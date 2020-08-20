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

package com.samsung.sds.brightics.agent.context.python.calcitePandas;

import org.apache.calcite.DataContext;
import org.apache.calcite.linq4j.Enumerable;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.rel.type.RelDataTypeFactory.Builder;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.rel.type.RelProtoDataType;
import org.apache.calcite.schema.ScannableTable;
import org.apache.calcite.schema.impl.AbstractTable;
import org.apache.calcite.sql.type.SqlTypeFactoryImpl;

import java.util.Map;


public class pandasTable extends AbstractTable implements ScannableTable {
    public RelProtoDataType protoRowType;
    public Map<String, String> columns;

    // Constructor
    pandasTable(Map<String, String> columns) {
        this.columns = columns;
    }

    // Implement this method when needed.
    public Enumerable<Object[]> scan(DataContext dataContext) {
        return null;
    }

    public RelDataType getRowType(RelDataTypeFactory relDataTypeFactory) {
        if (protoRowType != null) {
            return protoRowType.apply(relDataTypeFactory);
        } else {
            //Builder builder = new Builder(new JavaTypeFactoryImpl());
            Builder builder = new Builder(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT));
            for (String col : columns.keySet()) {
                try {
                    builder.add(col, DTypeConverter.javaToSqlType(columns.get(col))).nullable(true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return builder.build();
        }
    }

    public String toString() {
        return this.getClass().getSimpleName();
    }
}
