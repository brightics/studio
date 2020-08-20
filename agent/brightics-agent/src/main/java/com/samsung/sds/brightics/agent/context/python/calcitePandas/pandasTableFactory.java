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

import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.TableFactory;

import java.util.Map;

public class pandasTableFactory implements TableFactory<pandasTable> {

    public pandasTable create(SchemaPlus schema, String name, Map<String, Object> operand, RelDataType rowType) {
        Map<String, String> columns = (Map<String, String>) operand.get("columns");
        for (String col : columns.keySet()) {
            columns.put(col, columns.get(col).trim());
        }
        return new pandasTable(columns);
    }
}
