package com.samsung.sds.brightics.common.workflow.runner.job;

import com.samsung.sds.brightics.common.workflow.runner.vo.JobModelStatusVO;

public interface IModelRunner extends IFlowRunner {

	JobModelStatusVO getStatus();

}
