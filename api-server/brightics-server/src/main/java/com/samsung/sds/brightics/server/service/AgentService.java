package com.samsung.sds.brightics.server.service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.agent.AgentManager;
import com.samsung.sds.brightics.server.common.thread.concurrent.JobModelExecuteService;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrighticsAgent;
import com.samsung.sds.brightics.server.model.entity.repository.BrighticsAgentRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgentService {

	private static final Logger logger = LoggerFactory.getLogger(AgentService.class);

	@Autowired
	AgentManager agentManager;

	@Autowired
	AgentUserService agentUserService;

	@Autowired
	BrighticsAgentRepository brighticsAgentRepository;


	public static final String DEFAULT_AGENT_ID = "BRIGHTICS";
	public static final String DEDICATE_AGENT_TYPE = "DEDICATE";
	public static final String SHARED_AGENT_TYPE = "SHARED";

	public Map<String, Object> insertAgent(BrighticsAgent brighticsAgent) {
		List<BrighticsAgent> checkPort = brighticsAgentRepository
				.findByServerIpAndServerPort(brighticsAgent.getServerIp(), brighticsAgent.getServerPort());
		ValidationUtil.throwWhen(checkPort.size() != 0, "3002", "agent port");
		if (StringUtils.isEmpty(brighticsAgent.getAgentType())) {
			brighticsAgent.setAgentType(DEDICATE_AGENT_TYPE);
		}
		brighticsAgent.setUseYn("Y");
		brighticsAgentRepository.save(brighticsAgent, "agent");
		return ResultMapUtil.success("count", 1);
	}

	public Map<String, Object> updateAgent(BrighticsAgent brighticsAgent) {
		getBrighticsAgentOrThrow(brighticsAgent.getAgentId());
		String useYn = brighticsAgent.getUseYn();
		if (StringUtils.isEmpty(useYn)) {
			brighticsAgent.setUseYn("Y");
		}
		brighticsAgentRepository.update(brighticsAgent, "agent");
		return ResultMapUtil.success("count", 1);
	}

	public Map<String, Object> deleteAgent(String agentId) {
		BrighticsAgent brighticsAgent = getBrighticsAgentOrThrow(agentId);
		if (StringUtils.equals(agentId, DEFAULT_AGENT_ID)) {
			throw new BrighticsCoreException("3007", "agent");
		}
		if(agentManager.isExistAgent(agentId)){
			logger.info("[AGENT] The agent is stopped because agent has been deleted. agentId : " + brighticsAgent.getAgentId());
			stopAgent(agentId);
		}
		brighticsAgentRepository.delete(agentId, "agent");
		agentUserService.deleteAgentUserAsAgentId(agentId);
		logger.info("[AGENT] Delete mapping user list, agentId : " + brighticsAgent.getAgentId());
		return ResultMapUtil.success("count", 1);
	}

	public BrighticsAgent getBrighticsAgentOrThrow(String agentId) throws BrighticsCoreException {
		BrighticsAgent brighticsAgent = brighticsAgentRepository.findOne(agentId);
		ValidationUtil.throwIfEmpty(brighticsAgent, "agentId");
		return brighticsAgent;
	}

	public Map<String, Object> getAgentInfo(String agentId) {
		return ResultMapUtil.success(getBrighticsAgentOrThrow(agentId));
	}

	public Map<String, Object> checkAgentExists(String agentId) {
		if (brighticsAgentRepository.exists(agentId)) {
			throw new BrighticsCoreException("3002", "agent");
		}
		return ResultMapUtil.success("AgentID is not duplicate.");
	}

	public Map<String, Object> getAgentList() {
		Iterable<BrighticsAgent> agentList = brighticsAgentRepository.findAll();
		for (BrighticsAgent brighticsAgent : agentList) {
			String agentId = brighticsAgent.getAgentId();
			boolean existAgent = agentManager.isExistAgent(agentId);
			if (existAgent) {
				brighticsAgent.setStatus("RUN");
			} else {
				brighticsAgent.setStatus("STOP");
			}
		}
		return ResultMapUtil.success(agentList);
	}

	public List<String> getUsedSharedAgentIDList() {
		Iterable<BrighticsAgent> agentList = brighticsAgentRepository.findAll();
		List<String> sharedAgentIDList = new ArrayList<>();
		for (BrighticsAgent brighticsAgent : agentList) {
			if (SHARED_AGENT_TYPE.equals(brighticsAgent.getAgentType())
					&& "Y".equals(StringUtils.upperCase(brighticsAgent.getUseYn()))) {
				sharedAgentIDList.add(brighticsAgent.getAgentId());
			}
		}
		return sharedAgentIDList;
	}

    public Map<String, Object> startAgent(String agentId) {
        BrighticsAgent brighticsAgent = getBrighticsAgentOrThrow(agentId);
        agentManager.startAgent(brighticsAgent);
        return ResultMapUtil.success("SUCCESS");
    }

    public Map<String, Object> stopAgent(String agentId) {
        BrighticsAgent brighticsAgent = getBrighticsAgentOrThrow(agentId);
        JobModelExecuteService.removeAgentExecutor(brighticsAgent.getAgentId());
        agentManager.stopAgent(brighticsAgent);
        return ResultMapUtil.success("SUCCESS");
    }

	public Map<String, Object> stopAllAgent() {
		for (BrighticsAgent brighticsAgentInMem : brighticsAgentRepository.findAll()) {
			BrighticsAgent brighticsAgent = getBrighticsAgentOrThrow(brighticsAgentInMem.getAgentId());
			try {
                JobModelExecuteService.removeAgentExecutor(brighticsAgent.getAgentId());
				agentManager.stopAgent(brighticsAgent);
			} catch (Exception e) {
				logger.error("[AGENT] exception to stop agent. agent name : " + brighticsAgent.getAgentName(), e);
			}
		}
		return ResultMapUtil.success("SUCCESS");
	}

	public Map<String, Object> getAgentHealth(String agentId) {
		boolean existAgent = agentManager.isExistAgent(agentId);
		String aod = "STOP";
		if (existAgent) {
			aod = "RUN";
		}
		return ResultMapUtil.success(aod);
	}

	public void initAgent(String agentId) {
		boolean existAgent = agentManager.isExistAgent(agentId);
        JobModelExecuteService.addAgentExecutor(agentId);
		if (!existAgent) {
			logger.info("[AGENT] Agent status is stop. re-start agent");
			startAgent(agentId);
		}
	}

}
