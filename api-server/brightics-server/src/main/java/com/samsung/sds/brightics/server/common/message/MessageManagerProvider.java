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

package com.samsung.sds.brightics.server.common.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.server.common.message.database.DatabaseMessageManager;
import com.samsung.sds.brightics.server.common.message.deeplearning.DeeplearningMessageManager;
import com.samsung.sds.brightics.server.common.message.metadata.MetadataMessageManager;
import com.samsung.sds.brightics.server.common.message.stream.StreamMessageManager;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageManager;
import com.samsung.sds.brightics.server.common.network.BrighticsNetworkManager;
import com.samsung.sds.brightics.server.service.AgentService;
import com.samsung.sds.brightics.server.service.AgentUserService;

@Component
public class MessageManagerProvider {

	@Autowired
	BrighticsNetworkManager networkManager;

	@Autowired
	AgentUserService agentUserService;

	@Autowired
	AgentService agentService;

	private static final Logger logger = LoggerFactory.getLogger(MessageManagerProvider.class);

	private MessageSender agentGetOrStart() {
		String agentId = agentUserService.getAgentIdByCurrentUser();
		if(!networkManager.getSenderIds().contains(agentId)) {
			logger.info("Start the agent. agent Id is " +agentId);
			agentService.startAgent(agentId);
		}
		return networkManager.getSender(agentId);
	}
	
	public TaskMessageManager taskManager() {
		return new TaskMessageManager(agentGetOrStart());
	}

	public DatabaseMessageManager databaseManager() {
		return new DatabaseMessageManager(agentGetOrStart());
	}

	public StreamMessageManager streamManager() {
		return new StreamMessageManager(agentGetOrStart());
	}

	public MetadataMessageManager metadataManager() {
		return new MetadataMessageManager(agentGetOrStart());
	}

	public DeeplearningMessageManager deeplearningManager() {
		return new DeeplearningMessageManager(agentGetOrStart());
	}

}
