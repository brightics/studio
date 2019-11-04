package com.samsung.sds.brightics.agent.context.python.calcitepython;

import java.util.Map;

import org.apache.calcite.DataContext;
import org.apache.calcite.linq4j.Enumerable;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.rel.type.RelDataTypeFactory.FieldInfoBuilder;
import org.apache.calcite.schema.ScannableTable;
import org.apache.calcite.schema.impl.AbstractTable;
import org.apache.calcite.sql.type.SqlTypeFactoryImpl;
import org.apache.calcite.rel.type.RelDataTypeSystem;

public class S2pTable extends AbstractTable implements ScannableTable {
    Map<String, String> columns;

    S2pTable(Map<String, String> columns) {
        this.columns = columns;
    }


    public RelDataType getRowType(RelDataTypeFactory typeFactory) {
        
//            Builder builder = new Builder(new JavaTypeFactoryImpl());
            FieldInfoBuilder builder = new FieldInfoBuilder(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT));
            for (String col : columns.keySet()) {
                try {
                    builder.add(col, WriterUtil.getSqlType(((String) columns.get(col)))).nullable(true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return builder.build();
    }

    public String toString() {
        return "S2pTable";
    }

    public Enumerable<Object[]> scan(DataContext root) {
        return null;
    }

}