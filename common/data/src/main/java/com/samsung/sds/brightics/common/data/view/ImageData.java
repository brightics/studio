package com.samsung.sds.brightics.common.data.view;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.data.util.BinaryDataType;
import com.samsung.sds.brightics.common.data.util.BinaryDataUtil;

import java.io.IOException;
import java.util.Arrays;

public class ImageData extends BinaryData {

    //private BYTE_HEIGHT_FROM =
    //int OBJECT_BINARY_OFFSET = 27;
    private static int BYTE_HEIGHT_FROM = 0;
    private static int BYTE_WIDTH_FROM = 4;
    private static int BYTE_CHANNEL_FROM = 8;
    private static int BYTE_MODE_SIZE_FROM = 12;
    private static int BYTE_MODE_FROM = 12;
    //int modeFrom = modeSizeFrom + 4;
//    int widthFrom = heightFrom + 4;
//    int channelFrom = widthFrom + 4;
//    int modeSizeFrom = channelFrom + 4;
//    int modeFrom = modeSizeFrom + 4;

    private byte[] raw;
    private int height;
    private int width;
    private int numChannels;
    private String origin = null;
    private ImageDataMode mode;

    public ImageData(BinaryData binaryData) {
        this.data = binaryData.data;
        this.dataType = binaryData.dataType;
        checkValidImageType();

        height = BinaryDataUtil.bytesToInt(binaryData.data, BYTE_HEIGHT_FROM, BYTE_WIDTH_FROM, java.nio.ByteOrder.LITTLE_ENDIAN);
        width = BinaryDataUtil.bytesToInt(binaryData.data, BYTE_WIDTH_FROM, BYTE_CHANNEL_FROM, java.nio.ByteOrder.LITTLE_ENDIAN);
        numChannels = BinaryDataUtil.bytesToInt(binaryData.data, BYTE_CHANNEL_FROM, BYTE_MODE_SIZE_FROM, java.nio.ByteOrder.LITTLE_ENDIAN);

        int modeSize = BinaryDataUtil.bytesToInt(binaryData.data, BYTE_MODE_SIZE_FROM, BYTE_MODE_FROM, java.nio.ByteOrder.LITTLE_ENDIAN);
        int byteOriginFrom = BYTE_MODE_FROM + modeSize;

        mode = ImageDataMode.valueOf(BinaryDataUtil.bytesToString(binaryData.data, BYTE_MODE_FROM, byteOriginFrom));
    }

    public ImageData(Object obj) throws IOException {
        super(obj);
        checkValidImageType();
    }

    private void checkValidImageType() {
        if (this.dataType != BinaryDataType.Image) {
            throw new BrighticsCoreException("original BinaryData object is not a image type data.");
        }
    }
}
