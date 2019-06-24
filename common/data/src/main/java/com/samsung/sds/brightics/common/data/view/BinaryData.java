package com.samsung.sds.brightics.common.data.view;

import com.samsung.sds.brightics.common.data.util.BinaryDataType;
import javassist.bytecode.ByteArray;
import org.apache.commons.codec.digest.DigestUtils;

import java.io.*;
import java.util.Arrays;

public class BinaryData {

    private static byte[] BRIGHTICS_DATATYPE_BINARY_HEADER = DigestUtils.sha1Hex("brightics-studio v1.0").getBytes();
    protected static int BYTES_HEADER_INDEX = 27; // java object header length : 27
    private static int BYTES_TYPE_INDEX = 67; // brightics binary header length : 40
    private static int BYTES_DATA_INDEX = 68; // brightics binary data type length : 1

    protected byte[] data;

    public byte[] getData() {
        return data;
    }

    protected BinaryDataType dataType;

    public BinaryDataType getDataType() {
        return dataType;
    }

    public BinaryData() {
        data = null;
        dataType = BinaryDataType.Binary;
    }

    public BinaryData(Object obj) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        byte[] bytesFromStream;
        try {
            oos.writeObject(obj);
            oos.flush();
            bytesFromStream = bos.toByteArray();
        } finally {
            oos.close();
        }

        if (Arrays.equals(getBinaryDataHeader(bytesFromStream), BRIGHTICS_DATATYPE_BINARY_HEADER)) {
            data = getBinaryDataContents(bytesFromStream);
            if (getDataTypeFlag(bytesFromStream) == BinaryDataType.Image.getCode()) {
                // image type
                dataType = BinaryDataType.Image;
            } else {
                // others - binary
                dataType = BinaryDataType.Binary;
            }
        } else {
            // not a defined binary data
            data = bytesFromStream;
            dataType = BinaryDataType.Binary;
        }
    }

    private byte[] getBinaryDataHeader(byte[] rawData) {
        return Arrays.copyOfRange(rawData, BYTES_HEADER_INDEX, 40);
    }

    private byte[] getBinaryDataContents(byte[] rawData) {
        return Arrays.copyOfRange(rawData, BYTES_DATA_INDEX, rawData.length);
    }

    private byte getDataTypeFlag(byte[] rawData) {
        return Arrays.copyOfRange(rawData, BYTES_TYPE_INDEX, 1)[0];
    }
}
