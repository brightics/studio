/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.common.data.client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetFileWriter.Mode;
import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.metadata.CompressionCodecName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.parquet.reader.DefaultRecord;
import com.samsung.sds.brightics.common.data.parquet.reader.info.FileIndex;
import com.samsung.sds.brightics.common.data.parquet.reader.info.ParquetInformation;
import com.samsung.sds.brightics.common.data.parquet.reader.util.BrighticsParquetUtils;
import com.samsung.sds.brightics.common.data.parquet.writer.CsvParquetWriterBuilder;
import com.samsung.sds.brightics.common.data.util.DelimiterUtil;
import com.samsung.sds.brightics.common.data.view.Column;
import com.samsung.sds.brightics.common.data.view.JsonTable;
import com.samsung.sds.brightics.common.data.view.ObjectTable;
import com.samsung.sds.brightics.common.data.view.Table;

public class ParquetClient {

    public final static int LINES_PER_ONE_PARQUET_FILE = Integer
            .parseInt(SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_PARQUET_LINES_PER_FILE", "brightics.parquet.linesPerFile","100000"));
    public final static int ROW_GROUP_SIZE_IN_BYTE = 64 * 1024 * 1024;
    public final static int PAGE_SIZE_IN_BYTE = 1 * 1024 * 1024;

    static final Logger LOGGER = LoggerFactory.getLogger("ParquetClient");
    static FileSystem fileSystem;
    public static CompressionCodecName CODEC = CompressionCodecName.SNAPPY;
    private final static ObjectMapper MAPPER = new ObjectMapper();

    static synchronized FileSystem getFileSystem() {
        if (fileSystem == null) {
            try {
                fileSystem = FileSystem.get(new Configuration());
                CODEC = CompressionCodecName.fromConf(fileSystem.getConf().get("parquet.compression.codec", "snappy"));
            } catch (IOException e) {
                LOGGER.error("Can not initialize FileSystem due to IOException : " + e.getMessage());
            }
        }
        return fileSystem;
    }

    public static void writeCsvToParquet(InputStream linestream, String delim, String names, String types,
            int blockSize, String outputDirectory, boolean overwrite) throws IOException {
        writeCsvToParquet(linestream, delim, names, types, blockSize, outputDirectory, overwrite, false);
    }

    public static void writeCsvToParquet(InputStream linestream, String delim, String names, String types,
    		int blockSize, String outputDirectory, boolean overwrite, boolean isRemoveFirstLine) throws IOException {
    	if (overwrite) {
    		getFileSystem().delete(new Path(outputDirectory), true);
    	}
    	BufferedReader lineBuffer = new BufferedReader(new InputStreamReader(linestream));
    	String uuid = UUID.randomUUID().toString();
    	long lineCount = 0;
    	Integer partCount = 0;
    	ParquetWriter<String[]> writer = null;
    	String line = null;
    	if(isRemoveFirstLine){
    		lineBuffer.readLine(); //remove column line
    	}
    	try{
        	while ((line = lineBuffer.readLine()) != null) {
        		if (lineCount % LINES_PER_ONE_PARQUET_FILE == 0) {
        		    if(writer != null) writer.close();
        			partCount++;
        			writer = getParquetWriter(outputDirectory,
        					String.format("part-%05d-%s%s.parquet", partCount, uuid, CODEC.getExtension()), names, types);
        		}
        		writer.write(line.split(DelimiterUtil.getDelimiter(delim), -1));
        		lineCount++;
        	}
    	} catch (Exception e){
    	    throw new IOException("Data ["+ line +"] was not properly written.", e);
    	} finally{
    	    writer.close();
    	}
    }

    private static ParquetWriter<String[]> getParquetWriter(String parent, String fileName, String names, String types)
            throws IOException {
        return new CsvParquetWriterBuilder(new Path(parent, fileName), names, types).withWriteMode(Mode.OVERWRITE)
                .withCompressionCodec(CODEC).withRowGroupSize(ROW_GROUP_SIZE_IN_BYTE).withPageSize(PAGE_SIZE_IN_BYTE)
                .withDictionaryEncoding(false)
                .build();
    }

    public static ObjectTable readParquet(String path, long min, long max) throws IllegalArgumentException, IOException {
        ParquetInformation info = BrighticsParquetUtils.getParquetInformation(new Path(path), new Configuration());
        List<FileIndex> indexes = info.getLimitedFiles(min, max);

        List<Object[]> data = new ArrayList<>();
        for (FileIndex index : indexes) {
            ParquetReader<DefaultRecord> reader = null;
            try {
                long leftSkip = 0l;
                long rightSkip = 0l;
                
                long startIndex = index.getStartIndex();
                long endIndex = index.getEndIndex();
                String filePath = index.getFilePath();
                
                if (min > startIndex) {
                    leftSkip = min - startIndex;
                }
                if (max < endIndex) {
                    rightSkip = endIndex - max;
                }
                long numRowCount = endIndex - startIndex - leftSkip - rightSkip;
                reader = BrighticsParquetUtils.getReader(new Path(filePath));
                while (leftSkip > 0) {
                    reader.read();
                    leftSkip--;
                }
                DefaultRecord record;
                while ((record = reader.read()) != null && numRowCount > 0) {
                    data.add(record.getValues());
                    numRowCount--;
                }

            } finally {
                if (reader != null)
                    reader.close();
            }

        }

        Column[] schema = info.getSchema();
        return new ObjectTable(info.getCount(), data.size(), schema, data);
    }
    
    public static Table readSchema(String path) throws IllegalArgumentException, IOException {
        ParquetInformation info = BrighticsParquetUtils.getParquetInformation(new Path(path), new Configuration());
        Column[] schema = info.getSchema();
        return new Table(info.getCount(),info.getBytes(), schema);
    }
}
