package com.samsung.sds.brightics.server.common.agent;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.network.BrighticsNetworkManager;
import com.samsung.sds.brightics.server.common.util.AgentCommandUtil;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.model.entity.BrighticsAgent;
import com.samsung.sds.brightics.server.model.entity.repository.BrighticsAgentRepository;

/**
 * This class is that start or stop agent. check agent loading.
 */
@Component
public class AgentManager {

	private static final Logger LOGGER = LoggerFactory.getLogger(AgentManager.class);

	@Autowired
	private BrighticsNetworkManager networkManager;

	@Autowired
	BrighticsAgentRepository brighticsAgentRepository;

	@Value("${brightics.agent.observerPort:9643}")
	private String observerPort;

	private static final int AGENT_CONNECTION_TRY_MAX_COUNT = 120;

	public boolean isExistAgent(String agentId) {
		return networkManager.getSenderIds().contains(agentId);
	}

	private void updateAgentStartingInfo(String agentId, String user) {
		BrighticsAgent brighticsAgent = brighticsAgentRepository.findOne(agentId);
		LOGGER.info("[AGENT] update start time and user, start user: " + user);
		brighticsAgent
				.setLastStartTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
		brighticsAgentRepository.update(brighticsAgent, "agent");
	}

	public synchronized void startAgent(BrighticsAgent brighticsAgent) {
		String agentId = brighticsAgent.getAgentId();
		if (!isExistAgent(agentId)) {
			try {
				commandAgentStart(brighticsAgent);
				if (agentStatusChecker(agentId, true)) {
					LOGGER.info("[AGENT] Success to attach agent Agent ID : " + agentId);
					updateAgentStartingInfo(agentId, AuthenticationUtil.getRequestUserId());
				} else {
					throw new BrighticsCoreException("3201");
				}
			} catch (BrighticsCoreException e) {
				throw e;
			} catch (Exception e) {
			    LOGGER.error("[AGENT] Failed to start agent", e);
				throw new BrighticsCoreException("3201");
			}
		} else {
			LOGGER.info("[AGENT] Agent is already started. Agent ID : " + agentId);
		}
	}

	public void stopAgent(BrighticsAgent brighticsAgent) {
		try {
			commandAgentStop(brighticsAgent);
			if (!agentStatusChecker(brighticsAgent.getAgentId(), false)) {
				throw new BrighticsCoreException("3202");
			}
		} catch (IOException e) {
			LOGGER.error("[AGENT] Failed to stop agent", e);
			throw new BrighticsCoreException("3202");
		}
	}

	// For agent start method
	private void commandAgentStart(BrighticsAgent brighticsAgent) throws UnknownHostException, IOException {
		LOGGER.info("[AGENT] start agent, Agent ID : " + brighticsAgent.getAgentId());
		AgentCommandUtil cmd = new AgentCommandUtil.START().setName(brighticsAgent.getAgentId())
				.setPort(brighticsAgent.getServerPort()).setCores(brighticsAgent.getCores())
				.setMemInGB(brighticsAgent.getMemoryPerNodes());
		sendSocketCommand(brighticsAgent.getServerIp(), Integer.parseInt(observerPort), cmd);
	}

	private void commandAgentStop(BrighticsAgent brighticsAgent) throws UnknownHostException, IOException {
		LOGGER.info("[AGENT] stop agent, Agent ID : " + brighticsAgent.getAgentId());
		AgentCommandUtil cmd = new AgentCommandUtil.STOP().setName(brighticsAgent.getAgentId());
		sendSocketCommand(brighticsAgent.getServerIp(), Integer.parseInt(observerPort), cmd);
	}

	private void sendSocketCommand(String ip, int port, AgentCommandUtil cmd) throws UnknownHostException, IOException {
		LOGGER.info("[AGENT] Send command[{}] to observer[{}:{}]", cmd.toPlainCommandString(), ip, port);
		Socket socket = new Socket(ip, port);
		PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
		out.println(cmd.toPlainCommandString());
		out.close();
		socket.close();
	}

	private boolean agentStatusChecker(String agentId, boolean isStart) {
		ExecutorService executorService = Executors.newFixedThreadPool(10);
		Future<Boolean> future = executorService.submit(new Callable<Boolean>() {
			public Boolean call() {
				int time = 0;
				boolean status = false;
				try {
					while (time < AGENT_CONNECTION_TRY_MAX_COUNT && !status) {
						LOGGER.info(String.format("[AGENT] Check agent[%s] %s try count : %s status : %s", agentId,
								isStart ? "start" : "stop", time, status ? "RUN" : "STOP"));
						if(isStart) {
							status = isExistAgent(agentId);
						} else {
							status = !isExistAgent(agentId);
						}
						time += 1;
						Thread.sleep(1000L);
					}
				} catch (InterruptedException e) {
					LOGGER.error("[AGENT] Thread sleep InterruptedException. ", e);
				}
				return status;
			}
		});
		try {
			return future.get();
		} catch (Exception e) {
			LOGGER.error("[AGENT] ExecutorService Exception. ", e);
			return false;
		}
	}
}
