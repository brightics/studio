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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.model.context.WorkflowContextBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.jslib.WorkflowJsLibrary;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;

public class WorkflowModelRunner extends AbsModelRunner {

    private static final Logger logger = LoggerFactory.getLogger(WorkflowModelRunner.class);

    WorkflowModelRunner(JsonObject model, String pid) {
        super(model, pid);
    }

    @Override
    public void run(VariableContext variableContext) {
        String mid = model.get("mid").getAsString();

        // TODO realtime 로직 추가
//		int duration = model.get("duration").getAsInt();

        try {
            variableContext.addJsLibrary(new WorkflowJsLibrary());

            LoggerUtil.pushMDC("mid", mid);

            logger.info("[MODEL START]");
            JobContextHolder.getJobStatusTracker().startModel(mid, this.pid);

            WorkflowContext workflowContext = new WorkflowContextBuilder()
                .setModel(model)
                .setVariableContext(variableContext)
                .build();

            workflowContext.run();
            JobContextHolder.getJobStatusTracker().endModelWith(Status.SUCCESS);
            logger.info("[MODEL SUCCESS]");
        } catch (Exception e) {
            JobContextHolder.getJobStatusTracker().endModelWith(Status.FAIL);
            logger.error("[MODEL ERROR]", e);
            throw e;
        } finally {
            LoggerUtil.popMDC("mid");
        }
    }

}

