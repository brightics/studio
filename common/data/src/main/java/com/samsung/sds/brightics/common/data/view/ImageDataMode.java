package com.samsung.sds.brightics.common.data.view;

public enum ImageDataMode {
    BGR("BGR"), RGB("RGB"), GRAY("GRAY"), HSV("HSV");

    final private String name;

    ImageDataMode(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
