/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.agent.network.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.BrighticsAgent;
import com.samsung.sds.brightics.common.network.listener.AbstractTerminateListener;
import com.samsung.sds.brightics.common.network.proto.ClientReadyMessage;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;

public class TerminateListener extends AbstractTerminateListener {

	private static final Logger logger = LoggerFactory.getLogger(TerminateListener.class);

	@Override
	public void clientTerminated(String clientId) {
		logger.info("Server is terminated. start to retry connection.");
		Runnable retryServerConnectRunner = retryServerConnect();
		retryServerConnectRunner.run();
	}

	private Runnable retryServerConnect() {
		return new Runnable() {
			@Override
			public void run() {
				boolean isConnect = false;
				int count = 1;
				while (!isConnect) {
					logger.info("retry count : " + count);
					count++;
					try {
						Thread.sleep(5000);
						BrighticsAgent.network.getSender()
								.sendClientReady(ClientReadyMessage.newBuilder().setClientHost(BrighticsAgent.agentHost)
										.setClientPort(BrighticsAgent.agentPort).setClientId(BrighticsAgent.agentId)
										.build());
						isConnect = true;
						logger.info("Sucess reconnect.");
					} catch (Exception e) {
						logger.warn("Cannot send ready message to server.", e);
						isConnect = false;
					}

				}
			}
		};
	}

}
