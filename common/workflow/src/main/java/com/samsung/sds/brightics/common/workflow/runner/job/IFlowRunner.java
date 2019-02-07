package com.samsung.sds.brightics.common.workflow.runner.job;

import com.samsung.sds.brightics.common.variable.context.VariableContext;

public interface IFlowRunner {

	//run flow
	void run(VariableContext variableContext);
}
