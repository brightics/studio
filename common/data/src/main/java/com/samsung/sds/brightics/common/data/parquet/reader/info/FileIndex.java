package com.samsung.sds.brightics.common.data.parquet.reader.info;

public class FileIndex {
    String filePath;
    long startIndex;
    long endIndex;

    public FileIndex(String filePath, long startIndex, long endIndex) {
        super();
        this.filePath = filePath;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    public boolean contains(long fromIndex, long toIndex) {
        return startIndex != endIndex && startIndex < toIndex && endIndex > fromIndex;
    }

    public String getFilePath() {
        return filePath;
    }

    public long getStartIndex() {
        return startIndex;
    }

    public long getEndIndex() {
        return endIndex;
    }
    
    
}