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

package com.samsung.sds.brightics.common.data.view;


import java.util.HashMap;
import java.util.Map;

public class Table extends DataView<Map<String,Object>> {

    private static final long serialVersionUID = -7308686935509191570L;

    public Table(long count, long bytes, Column[] schema) {
        super("table", new HashMap<String, Object>());
        this.data.put("count", count);
        this.data.put("bytes", bytes);
        this.data.put("schema", schema);
    }
}
