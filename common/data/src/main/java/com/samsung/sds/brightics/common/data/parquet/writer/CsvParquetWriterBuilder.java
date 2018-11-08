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
