package com.samsung.sds.brightics.server.common.message.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage;
import com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage;
import com.samsung.sds.brightics.common.network.sender.MessageSender;

public class DatabaseMessageManager {
	private static final Logger logger = LoggerFactory.getLogger(DatabaseMessageManager.class);
	private final MessageSender sender;

	public DatabaseMessageManager(MessageSender sender) {
		this.sender = sender;
	}

	public ResultDBMessage sendDatabaseInfo(ExecuteDBMessage message) {
		logger.info("[DATA BASE INFO] UserID: " + message.getUser() + " , Message : " + message.toString());
		return sender.sendDatabaseInfo(message);
	}

}
