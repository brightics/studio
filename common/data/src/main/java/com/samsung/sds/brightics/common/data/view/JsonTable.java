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

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonTable extends Table {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final long serialVersionUID = -2975422520717348573L;

    public JsonTable(long count, long bytes, Column[] schema, String jsonString) {
        super(count, bytes, schema);
        try {
            this.data.put("data", mapper.readValue(jsonString, Object.class));
        } catch (IOException e) {
            throw new IllegalArgumentException("invalid json data", e);
        }
    }
}
