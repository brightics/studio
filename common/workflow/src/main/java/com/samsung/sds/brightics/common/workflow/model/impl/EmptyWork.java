package com.samsung.sds.brightics.common.workflow.model.impl;

import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Work;

public class EmptyWork extends Work {

    public EmptyWork(String name) {
        super(name, new ParametersBuilder().build());
    }

    @Override
    public void start(WorkContext context) {
        // do nothing
    }
}
