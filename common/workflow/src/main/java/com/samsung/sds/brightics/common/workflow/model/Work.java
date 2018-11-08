package com.samsung.sds.brightics.common.workflow.model;

import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;

public abstract class Work extends Node {

    public Work(String name, Parameters parameters) {
        super(name, parameters);
    }

    public abstract void start(WorkContext context);

    public void stop() {String unnecessary;}
}
