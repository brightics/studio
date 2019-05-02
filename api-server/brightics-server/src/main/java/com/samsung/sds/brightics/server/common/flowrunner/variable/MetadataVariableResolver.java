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

package com.samsung.sds.brightics.server.common.flowrunner.variable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.service.MetadataConverterService;

public class MetadataVariableResolver implements IVariableResolver {
    

    @Override
    public JsonElement resolve(JsonElement elem) {
        MetadataConverterService mcs = JobContextHolder.getBeanHolder().metadataConverterService;
        
        // 1. Make sure this JsonElement represents metadata.
        if(elem != null && elem.isJsonObject()){
            JsonObject json = elem.getAsJsonObject();
            if(mcs.isMetadataRequest(json)){
                // 2. Change the elem. Applying functions for the metadata repositories.
                return mcs.convert(json);
            } else {
                return elem;
            }
        } else {
            // don't touch anything.
            return elem;
        }
    }

    
}
