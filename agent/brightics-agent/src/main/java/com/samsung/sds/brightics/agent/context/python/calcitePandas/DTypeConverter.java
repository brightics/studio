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


import org.apache.calcite.sql.type.SqlTypeName;

public class DTypeConverter {

    static public SqlTypeName javaToSqlType(String typename) throws Exception {
        if (typename.equalsIgnoreCase("double")) {
            return SqlTypeName.DOUBLE;
        } else if (typename.equalsIgnoreCase("string")) {
            return SqlTypeName.VARCHAR;
        } else if (typename.equalsIgnoreCase("integer")) {
            return SqlTypeName.INTEGER;
        } else if (typename.equalsIgnoreCase("boolean")) {
            return SqlTypeName.BOOLEAN;
        } else {
            throw new Exception("Unsupported data type.");
        }
    }

    static public DTypes sqlToJavaType(SqlTypeName sqlTypeName) {
        switch (sqlTypeName) {
            case BIGINT:
            case INTEGER:
                return DTypes.INT64;
            case VARCHAR:
                return DTypes.OBJECT;
            case DOUBLE:
            case DECIMAL:
                return DTypes.FLOAT64;
            default:
                return null;
        }
    }
}

