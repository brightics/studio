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

package com.samsung.sds.brightics.common.data.parquet.writer;

import java.util.Locale;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.api.WriteSupport;

public class CsvParquetWriterBuilder extends ParquetWriter.Builder<String[],CsvParquetWriterBuilder> {

    String fieldNames;
    String fieldTypes;
    
    protected CsvParquetWriterBuilder(Path file) {
        super(file);
    }
    
    /**
     * Constructs csv writer builder.
     * 
     * @param file output path
     * @param fieldNames Comma separated field names
     * @param fieldTypes Comma separated field types
     */
    public CsvParquetWriterBuilder(Path file, String fieldNames, String fieldTypes){
        super(file);
        this.fieldNames = fieldNames;
        this.fieldTypes = fieldTypes;
    }
    
    @Override
    protected CsvParquetWriterBuilder self() {
        return this;
    }

    @Override
    protected WriteSupport<String[]> getWriteSupport(Configuration conf) {
        conf.set(CsvParquetConfigKey.BRIGHTICS_CSV_SCHEMA_FIELD_NAMES, fieldNames);
        conf.set(CsvParquetConfigKey.BRIGHTICS_CSV_SCHEMA_FIELD_TYPES, fieldTypes.toLowerCase(Locale.ENGLISH));
        CsvParquetWriteSupport writeSupport = new CsvParquetWriteSupport();
        writeSupport.init(conf);
        return writeSupport;
    }

}
