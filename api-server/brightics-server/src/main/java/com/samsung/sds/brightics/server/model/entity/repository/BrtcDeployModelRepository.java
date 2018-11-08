package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrtcDeployModel;
import com.samsung.sds.brightics.server.model.entity.BrtcDeployModelPk;

public interface BrtcDeployModelRepository extends BrtcRepository<BrtcDeployModel,BrtcDeployModelPk> {

	public List<BrtcDeployModel> findByRegisterUserId(String registerUserId);
}
