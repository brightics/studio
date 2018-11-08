package com.samsung.sds.brightics.server.common.message.task;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.BrighticsUncodedException;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;
import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;

public class TaskMessageManager {

	private static final Logger logger = LoggerFactory.getLogger(MessageManagerProvider.class);
	private final MessageSender sender;

	public TaskMessageManager(MessageSender sender) {
		this.sender = sender;
	}

	public void sendAsyncTask(ExecuteTaskMessage message) {
		logger.info("[TASK SENT] UserID: " + message.getUser() + " , Message : " + message.toString());
		sender.sendAsyncTask(message);
		TaskMessageRepository.saveRunningMessage(message.getTaskId(), message);
	}

	public Object sendSyncTask(ExecuteTaskMessage message) {
		logger.info("[TASK SENT] UserID: " + message.getUser() + " , Message : " + message.toString());
		ResultTaskMessage result = sender.sendSyncTask(message);
		return messageParser(result);
	}

	public void sendStopTask(StopTaskMessage message) {
		logger.info("[STOP TASK] UserID: " + message.getUser() + " , Message : " + message.toString());
		sender.sendStopTask(message);
	}

	public Object getAsyncTaskResult(String taskId) {
		ResultTaskMessage message = TaskMessageRepository.getMessageResultAsTaskId(taskId);
		return messageParser(message);
	}

	private String messageParser(ResultTaskMessage message) {
		MessageStatus status = message.getMessageStatus();
		try {
			if (MessageStatus.SUCCESS == status) {
				SuccessResult successResult = message.getResult().unpack(SuccessResult.class);
				return successResult.getResult();
			} else {
				FailResult successResult = message.getResult().unpack(FailResult.class);
				String exceptionMessage = successResult.getMessage();
				String detailMessage = successResult.getDetailMessage();
				throw new BrighticsUncodedException(exceptionMessage, detailMessage);
			}
		} catch (InvalidProtocolBufferException e) {
			throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
		}
	}
}
