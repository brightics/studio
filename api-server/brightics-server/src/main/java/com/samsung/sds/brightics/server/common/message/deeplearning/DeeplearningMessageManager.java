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
