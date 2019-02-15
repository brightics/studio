package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;


public class DeeplearningflowModelRunner extends AbsModelRunner {

    private static final Logger logger = LoggerFactory.getLogger(DeeplearningflowModelRunner.class);

    DeeplearningflowModelRunner(JsonObject model, String pid) {
        super(model, pid);
    }

    @Override
    public void run(VariableContext variableContext) {
        String mid = model.get("mid").getAsString();
        try {
            LoggerUtil.pushMDC("mid", mid);
            String jid = (String) variableContext.getValue("sys.jid");
            logger.info("[DL MODEL START]");
            JobContextHolder.getJobStatusTracker().startModel(mid, this.pid);
            JobContextHolder.getJobRunnerAPI().executeDLScript(model, jid);
        } catch (Exception e) {
            JobContextHolder.getJobStatusTracker().endModelWith(Status.FAIL);
            logger.error("[DL MODEL ERROR]", e);
            throw e;
        } finally {
            LoggerUtil.popMDC("mid");
        }
    }
}
