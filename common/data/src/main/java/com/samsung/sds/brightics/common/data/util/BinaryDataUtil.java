package com.samsung.sds.brightics.common.data.util;

import java.nio.ByteOrder;
import java.util.Arrays;

public class BinaryDataUtil {

    public static int bytesToInt(byte[] bytes, int from, int to, ByteOrder bOrder) {
        return java.nio.ByteBuffer.wrap(Arrays.copyOfRange(bytes, from, to)).order(bOrder).getInt();
    }

    public static String bytesToString(byte[] bytes, int from, int to) {
        return new String(java.nio.ByteBuffer.wrap(Arrays.copyOfRange(bytes, from, to)).array());
    }
}
