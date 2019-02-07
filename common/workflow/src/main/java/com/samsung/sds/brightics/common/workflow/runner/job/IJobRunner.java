package com.samsung.sds.brightics.common.workflow.runner.job;

import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;

public interface IJobRunner extends IFlowRunner {
	
	JobStatusVO getStatus();
	
}
