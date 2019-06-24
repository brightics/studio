package com.samsung.sds.brightics.common.data.util;

public enum BinaryDataType {
    Binary("binary", (byte) 255), Image("image", (byte) 0), Sound("sound", (byte) 1);

    final private String name;
    final private byte code;

    BinaryDataType(String name, byte code) {
        this.name = name;
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public byte getCode() {
        return code;
    }
}
