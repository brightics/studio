package com.samsung.sds.brightics.common.data.parquet.reader.info;

import java.util.List;
import java.util.stream.Collectors;

import com.samsung.sds.brightics.common.data.view.Column;

public class ParquetInformation {
    
    Column[] schema;
    long count;
    long bytes;
    List<FileIndex> page;
    
    public ParquetInformation(Column[] schema, long count, long bytes, List<FileIndex> page) {
        super();
        this.schema = schema;
        this.count = count;
        this.bytes = bytes;
        this.page = page;
    }

    public List<FileIndex> getLimitedFiles(long lowerOffset, long upperOffset) {
        return page.stream()
                .filter(index -> index.contains(lowerOffset, upperOffset))
                .collect(Collectors.toList());
    }

    public Column[] getSchema() {
        return schema;
    }

    public long getCount() {
        return count;
    }

    public long getBytes() {
        return bytes;
    }

    public List<FileIndex> getPage() {
        return page;
    }
    
    
    
}
