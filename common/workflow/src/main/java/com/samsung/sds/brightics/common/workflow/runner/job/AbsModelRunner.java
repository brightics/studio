package com.samsung.sds.brightics.common.workflow.runner.job;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.workflow.runner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobModelStatusVO;

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
