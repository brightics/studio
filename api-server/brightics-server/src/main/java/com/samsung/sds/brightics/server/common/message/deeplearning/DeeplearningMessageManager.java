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

package com.samsung.sds.brightics.server.common.message.deeplearning;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage;
import com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage;
import com.samsung.sds.brightics.common.network.sender.MessageSender;

public class DeeplearningMessageManager {
	private static final Logger logger = LoggerFactory.getLogger(DeeplearningMessageManager.class);
	private final MessageSender sender;

	public DeeplearningMessageManager(MessageSender sender) {
		this.sender = sender;
	}

	public ResultDLMessage sendDeeplearningInfo(ExecuteDLMessage message) {
		logger.info("[DEEP LEARNING INFO] UserID: " + message.getUser() + " , Message : " + message.toString());
		return sender.sendDeeplearningInfo(message);
	}

}
