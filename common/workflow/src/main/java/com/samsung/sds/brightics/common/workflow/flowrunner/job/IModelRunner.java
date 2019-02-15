package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobModelStatusVO;

public interface IModelRunner extends IFlowRunner {

    JobModelStatusVO getStatus();
}
