package com.samsung.sds.brightics.server.common.flowrunner;

import com.samsung.sds.brightics.server.model.vo.JobStatusVO;

interface IJobRunner extends IFlowRunner {

    JobStatusVO getStatus();
}
