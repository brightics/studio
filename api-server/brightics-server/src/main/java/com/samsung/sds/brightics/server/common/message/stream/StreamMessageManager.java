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

package com.samsung.sds.brightics.server.common.message.stream;

import java.io.InputStream;
import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;
import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;

public class StreamMessageManager {
	private static final Logger logger = LoggerFactory.getLogger(StreamMessageManager.class);
	private final MessageSender sender;

	public StreamMessageManager(MessageSender sender) {
		this.sender = sender;
	}

	public void sendFile(WriteMessage message, InputStream inputstream, boolean isSchemaRemove) throws Exception {
		logger.info(
				"[FILE SENT] UserID: " + AuthenticationUtil.getRequestUserId() + " , Message : " + message.toString());
		sender.sendFile(message, inputstream, isSchemaRemove);
	}

	public void receiveFile(ReadMessage message, OutputStream outputstream) throws Exception {
		logger.info("[FILE RECEIVE] UserID: " + AuthenticationUtil.getRequestUserId() + " , Message : "
				+ message.toString());
		sender.receiveFile(message, outputstream);
	}
}
