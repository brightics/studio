package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrighticsAgentUserMap;

public interface BrighticsAgentUserMapRepository extends BrtcRepository<BrighticsAgentUserMap, String>{

	public List<BrighticsAgentUserMap> findByAgentId(String agentId);
	
}
