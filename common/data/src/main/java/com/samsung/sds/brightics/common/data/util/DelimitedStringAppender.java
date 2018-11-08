package com.samsung.sds.brightics.common.data.util;

public class DelimitedStringAppender {

    boolean isFirst = true;
    StringBuilder builder;
    String delimiter;
    String endChar;

    public DelimitedStringAppender(String startChar, String endChar, String delimiter) {
        this.delimiter = delimiter;
        this.builder = new StringBuilder(startChar);
        this.endChar = endChar;
    }

    public void append(String str) {
        if (isFirst) {
            builder.append(str);
            isFirst = false;
        } else {
            builder.append(delimiter);
            builder.append(str);
        }
    }

    @Override
    public String toString() {
        builder.append(endChar);
        return builder.toString();
    }
    
}
