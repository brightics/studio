package com.samsung.sds.brightics.common.data.view;

public class DataViewJson {

    private static final String template = "{\"type\":\"%s\",\"data\":%s}";

    public static String fromRawJsonData(String type, String rawJsonData) {
        return String.format(template, type, rawJsonData);
    }
}
