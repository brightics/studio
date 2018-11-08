package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrtcJobStatusHist;
import com.samsung.sds.brightics.server.model.entity.BrtcJobStatusHistPk;

public interface BrtcJobStatusHistRepository extends BrtcRepository<BrtcJobStatusHist, BrtcJobStatusHistPk> {
	
	public List<BrtcJobStatusHist> findByJobId(String jobId);

}
