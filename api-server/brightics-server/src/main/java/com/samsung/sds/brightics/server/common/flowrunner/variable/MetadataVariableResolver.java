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
