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

package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobModelStatusVO;

import lombok.Getter;

public abstract class AbsModelRunner implements IModelRunner {

    @Getter
    protected JsonObject model;
    protected String pid;
    private final JobModelStatusVO status;

    AbsModelRunner(JsonObject model, String pid) {
        if (model == null) {
            throw new BrighticsCoreException("3110");
        }

        this.model = model;
        if (!model.has("links")) {
            model.add("links", new JsonArray());
        }

        if (!model.has("variables")) {
            model.add("variables", new JsonObject());
        }
        this.pid = pid + "_pid";
        this.status = JobContextHolder.getJobStatusTracker().addModel(model.get("mid").getAsString(), this.pid);
    }

    @Override
    public JobModelStatusVO getStatus() {
        return this.status;
    }
}
