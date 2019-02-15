package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;

interface IJobRunner extends IFlowRunner {

    JobStatusVO getStatus();
}
