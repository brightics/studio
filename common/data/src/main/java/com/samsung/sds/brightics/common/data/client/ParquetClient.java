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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.parquet.reader.DefaultRecord;
import com.samsung.sds.brightics.common.data.parquet.reader.info.FileIndex;
import com.samsung.sds.brightics.common.data.parquet.reader.info.ParquetInformation;
import com.samsung.sds.brightics.common.data.parquet.reader.util.BrighticsParquetUtils;
import com.samsung.sds.brightics.common.data.parquet.writer.CsvParquetWriterBuilder;
import com.samsung.sds.brightics.common.data.util.BinaryDataType;
import com.samsung.sds.brightics.common.data.util.DelimiterUtil;
import com.samsung.sds.brightics.common.data.view.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetFileWriter.Mode;
import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.metadata.CompressionCodecName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.*;
import java.nio.ByteOrder;
import java.util.*;

public class ParquetClient {

    public final static int LINES_PER_ONE_PARQUET_FILE = Integer
            .parseInt(SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_PARQUET_LINES_PER_FILE", "brightics.parquet.linesPerFile", "100000"));
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
        if (isRemoveFirstLine) {
            lineBuffer.readLine(); //remove column line
        }
        try {
            while ((line = lineBuffer.readLine()) != null) {
                if (lineCount % LINES_PER_ONE_PARQUET_FILE == 0) {
                    if (writer != null) writer.close();
                    partCount++;
                    writer = getParquetWriter(outputDirectory,
                            String.format("part-%05d-%s%s.parquet", partCount, uuid, CODEC.getExtension()), names, types);
                }
                writer.write(line.split(DelimiterUtil.getDelimiter(delim), -1));
                lineCount++;
            }
        } catch (Exception e) {
            throw new IOException("Data [" + line + "] was not properly written.", e);
        } finally {
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

    private static int bytesToInt(byte[] bytes, int from, int to, ByteOrder bOrder) {
        return java.nio.ByteBuffer.wrap(Arrays.copyOfRange(bytes, from, to)).order(bOrder).getInt();
    }

    public static ObjectTable readParquet(String path, long min, long max) throws IllegalArgumentException, IOException {
        ParquetInformation info = BrighticsParquetUtils.getParquetInformation(new Path(path), new Configuration());
        List<FileIndex> indexes = info.getLimitedFiles(min, max);
        Column[] schema = info.getSchema();

        // TODO: Find Indices of image columns
        // TODO: Need Extract to separated method
        int OBJECT_BINARY_OFFSET = 27;
        int heightFrom = OBJECT_BINARY_OFFSET + 41;
        int widthFrom = heightFrom + 4;
        int channelFrom = widthFrom + 4;
        int modeSizeFrom = channelFrom + 4;
        int modeFrom = modeSizeFrom + 4;

        byte[] BRIGHTICS_DATATYPE_BINARY_HEADER = DigestUtils.sha1Hex("brightics-studio v1.0").getBytes();

        List<Integer> binaryColumnIndices = new ArrayList<>();
        for (int columnIndex = 0; columnIndex < schema.length; columnIndex++) {
            Column columnInfo = schema[columnIndex];
            String columnType = columnInfo.getColumnType();
            if ("binary".equals(columnType)) {
                binaryColumnIndices.add(columnIndex);
            }
        }
        LOGGER.debug("binary column indices == " + binaryColumnIndices.toString());

        // TODO: move code location
        // convert image column type name
        for (int imageColIdx : binaryColumnIndices) {
            LOGGER.debug("change column type of '" + schema[imageColIdx] + "' to image.");
            schema[imageColIdx].setColumnType("image");
        }

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

                    // TODO: IMAGE COLUMN CONVERTING
                    // TODO: Extract this to the separated method
                    Object[] rowValue = record.getValues();
                    LOGGER.debug("row value size == " + rowValue.length + ", schema length == " + schema.length);
                    for (int binaryColIdx : binaryColumnIndices) {
                        Object originalBinaryData = rowValue[binaryColIdx];
                        BinaryData binaryData = new BinaryData(originalBinaryData);

                        if(binaryData.getDataType() == BinaryDataType.Image) {
                            ImageData imageData = new ImageData(binaryData);
                        }

                        ByteArrayOutputStream bos = new ByteArrayOutputStream();
                        try {

                            ObjectOutputStream oos = new ObjectOutputStream(bos);
                            oos.writeObject(originalBinaryData);
                            oos.flush();
                            byte[] binaryDataBytes = bos.toByteArray();
                            byte[] binaryDataHeader = new byte[40];
                            System.arraycopy(binaryDataBytes, OBJECT_BINARY_OFFSET, binaryDataHeader, 0, 40);

//                            LOGGER.debug("index == " + imageColIdx + " image data type1 == " + imageBytes[0]
//                                    + " image object length = " + imageBytes.length);
                            if (Arrays.equals(binaryDataHeader, BRIGHTICS_DATATYPE_BINARY_HEADER)) {

                                byte dataTypeCode = binaryDataBytes[OBJECT_BINARY_OFFSET + 40];
                                LOGGER.debug("binary type : " + dataTypeCode);

                                if (dataTypeCode == 0b00) {
                                    // image type
//                                    brtc_code(40)::data_type(1)::height(4)::width(4)::n_channels(4)::
//                                    mode_size(4)::mode(mode_size)::
//                                    origin_size(4)::origin(origin_size)::
//                                    data_size(4)::data(data_size)

                                    int height = bytesToInt(binaryDataBytes, heightFrom, widthFrom, java.nio.ByteOrder.LITTLE_ENDIAN);
                                    int width = bytesToInt(binaryDataBytes, widthFrom, channelFrom, java.nio.ByteOrder.LITTLE_ENDIAN);
                                    int channel = bytesToInt(binaryDataBytes, channelFrom, modeSizeFrom, java.nio.ByteOrder.LITTLE_ENDIAN);
                                    int modeSize = bytesToInt(binaryDataBytes, modeSizeFrom, modeFrom, java.nio.ByteOrder.LITTLE_ENDIAN);

                                    int originSizeFrom = modeFrom + modeSize;
                                    String mode = new String(java.nio.ByteBuffer.wrap(Arrays.copyOfRange(binaryDataBytes, modeFrom, originSizeFrom)).array());

                                    int originFrom = originSizeFrom + 4;
                                    int originSize = bytesToInt(binaryDataBytes, originSizeFrom, originFrom, java.nio.ByteOrder.LITTLE_ENDIAN);

                                    int dataSizeFrom = originFrom + originSize;
                                    String origin = new String(java.nio.ByteBuffer.wrap(Arrays.copyOfRange(binaryDataBytes, originFrom, dataSizeFrom)).array());

                                    int dataFrom = dataSizeFrom + 4;
                                    int dataSize = bytesToInt(binaryDataBytes, dataSizeFrom, dataFrom, java.nio.ByteOrder.LITTLE_ENDIAN);

                                    int dataTo = dataFrom + dataSize;
                                    byte[] imageData = java.nio.ByteBuffer.wrap(Arrays.copyOfRange(binaryDataBytes, dataFrom, dataTo)).array();

                                    ByteArrayOutputStream imagebos = new ByteArrayOutputStream();
                                    BufferedImage image;
                                    if ("GRAY".equals(mode)) {
                                        image = new BufferedImage(width, height, BufferedImage.TYPE_BYTE_GRAY);
                                    } else {
                                        image = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
                                    }
                                    final byte[] targetPixels = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
                                    System.arraycopy(imageData, 0, targetPixels, 0, imageData.length);

                                    JPEGImageWriteParam jpegParams = new JPEGImageWriteParam(null);
                                    jpegParams.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                                    jpegParams.setCompressionQuality(0.5f);

                                    final ImageWriter iw = ImageIO.getImageWritersByFormatName("jpg").next();
                                    ByteArrayOutputStream imageBos = new ByteArrayOutputStream();
                                    try {
                                        iw.setOutput(new MemoryCacheImageOutputStream(imageBos));
                                        iw.write(null, new IIOImage(image, null, null), jpegParams);

                                        String imageStr = "data:image/jpg;base64," + new String(Base64.getEncoder().encode(imageBos.toByteArray()));

                                        LOGGER.debug("changing image data...");
                                        JsonObject imageInfoJson = new JsonObject();
                                        imageInfoJson.addProperty("height", height);
                                        imageInfoJson.addProperty("width", width);
                                        imageInfoJson.addProperty("channel", channel);
                                        imageInfoJson.addProperty("mode", mode);
                                        imageInfoJson.addProperty("origin", origin);

                                        JsonObject imageJson = new JsonObject();
                                        imageJson.addProperty("data", imageStr);
                                        imageJson.add("info", imageInfoJson);

                                        LOGGER.debug("height = " + height + ", width = " + width + ", channel = " + channel
                                                + ", modeSize = " + modeSize + ", mode = " + mode
                                                + ", originSize = " + originSize + ", origin = " + origin
                                                + ", dataSize = " + dataSize);
                                        String imageJsonString = new Gson().toJson(imageJson);
                                        LOGGER.debug("image string : " + imageJsonString);
                                        record.add(binaryColIdx, imageJsonString);
                                    } finally {
                                        imageBos.close();
                                    }
                                }
                            }
                        } finally {
                            bos.close();
                        }
                    }

                    data.add(record.getValues());
                    numRowCount--;
                }

            } finally {
                if (reader != null)
                    reader.close();
            }
        }
        return new ObjectTable(info.getCount(), data.size(), schema, data);
    }

    public static Table readSchema(String path) throws IllegalArgumentException, IOException {
        ParquetInformation info = BrighticsParquetUtils.getParquetInformation(new Path(path), new Configuration());
        Column[] schema = info.getSchema();
        return new Table(info.getCount(), info.getBytes(), schema);
    }
}
