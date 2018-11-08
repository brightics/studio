package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrighticsAgent;

public interface BrighticsAgentRepository extends BrtcRepository<BrighticsAgent, String> {
    List<BrighticsAgent> findByServerIpAndServerPort(String serverIp, String serverPort);
}
