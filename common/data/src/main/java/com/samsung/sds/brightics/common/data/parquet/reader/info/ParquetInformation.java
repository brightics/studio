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

package com.samsung.sds.brightics.common.data.parquet.reader.info;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.samsung.sds.brightics.common.data.view.Column;

public class ParquetInformation {

    Column[] schema;
    long count;
    long bytes;
    List<FileIndex> page;
    int[] columnIndex;

    public ParquetInformation(Column[] schema, long count, long bytes, List<FileIndex> page) {
        this(schema, count, bytes, page, new int[0]);
    }

    public ParquetInformation(Column[] schema, long count, long bytes, List<FileIndex> page, int[] columnIndex) {
        super();
        this.schema = schema;
        this.count = count;
        this.bytes = bytes;
        this.page = page;
        this.columnIndex = columnIndex;
    }

    public List<FileIndex> getLimitedFiles(long lowerOffset, long upperOffset) {
        return page.stream()
                .filter(index -> index.contains(lowerOffset, upperOffset))
                .collect(Collectors.toList());
    }

    public Column[] getSchema() {
        return schema;
    }

    public int[] getColumnIndex() {
        return columnIndex;
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
