package com.samsung.sds.brightics.common.workflow.flowrunner.variable;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;

public class MetadataVariableResolver implements IVariableResolver {
    

    @Override
    public JsonElement resolve(JsonElement elem) {
        // 1. Make sure this JsonElement represents metadata.
        if(elem != null && elem.isJsonObject()){
            JsonObject json = elem.getAsJsonObject();
            if(JobContextHolder.getJobRunnerAPI().isMetadataRequest(json)){
                // 2. Change the elem. Applying functions for the metadata repositories.
                return JobContextHolder.getJobRunnerAPI().convert(json);
            } else {
                return elem;
            }
        } else {
            // don't touch anything.
            return elem;
        }
    }

    
}
