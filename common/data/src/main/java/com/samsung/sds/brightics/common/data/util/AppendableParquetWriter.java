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

package com.samsung.sds.brightics.common.data.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.UUID;

import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetFileWriter.Mode;
import org.apache.parquet.hadoop.ParquetWriter;

import com.samsung.sds.brightics.common.data.client.FileClient;
import com.samsung.sds.brightics.common.data.client.ParquetClient;
import com.samsung.sds.brightics.common.data.parquet.writer.CsvParquetWriterBuilder;

public class AppendableParquetWriter implements Closeable {

//	private static final Logger logger = LoggerFactory.getLogger(AppendableParquetWriter.class);
	public String user;
	public String outputDirectory;
	public String key;
	String delim;
	String names;
	String types;
	String uuid;

	long lineCount = 0;
	Integer partCount = 0;
	ParquetWriter<String[]> writer = null;

	public AppendableParquetWriter(String user, String delim, String names, String types, String outputDirectory,
			boolean overwrite, String key) throws Exception {
		if (overwrite) {
			FileClient.getFileSystem().delete(new Path(outputDirectory), true);
		}
		this.user = user;
		this.delim = DelimiterUtil.getDelimiter(delim);
		this.names = names;
		this.types = types;
		this.outputDirectory = outputDirectory;
		this.uuid = UUID.randomUUID().toString();
		this.key = key;

	}
	
	public void append(byte[] data) throws IOException {
		BufferedReader lineBuffer = new BufferedReader(new InputStreamReader(new ByteArrayInputStream(data), "UTF-8"));
		String line = null;
		while ((line = lineBuffer.readLine()) != null) {
			if (lineCount % ParquetClient.LINES_PER_ONE_PARQUET_FILE == 0) {
			    if(writer != null) writer.close();
				partCount++;
				String fileName = String.format("part-%05d-%s%s.parquet", partCount, uuid,
						ParquetClient.CODEC.getExtension());
				writer = new CsvParquetWriterBuilder(new Path(outputDirectory, fileName), names, types)
						.withWriteMode(Mode.OVERWRITE).withCompressionCodec(ParquetClient.CODEC)
						.withRowGroupSize(ParquetClient.ROW_GROUP_SIZE_IN_BYTE)
						.withDictionaryEncoding(false)
						.withPageSize(ParquetClient.PAGE_SIZE_IN_BYTE).build();
			}
			writer.write(line.split(delim, -1));
			lineCount++;
		}
	}

	@Override
	public void close() throws IOException {
		if(writer!= null ){
			writer.close();
		}
	}

}
