package com.samsung.sds.brightics.server.common.flowrunner;

import com.samsung.sds.brightics.server.model.vo.JobModelStatusVO;

public interface IModelRunner extends IFlowRunner {

    JobModelStatusVO getStatus();
}
