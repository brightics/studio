package com.samsung.sds.brightics.server.common.message.task;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.BrighticsFunctionException;
import com.samsung.sds.brightics.common.core.exception.BrighticsFunctionException.brighticsErrorVO;
import com.samsung.sds.brightics.common.core.exception.BrighticsUncodedException;
import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;
import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.common.util.FunctionPropertiesUtil;

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

	/**
	 * function or script task result parser.
	 * @param message
	 * @return
	 */
	private String messageParser(ResultTaskMessage message) {
		MessageStatus status = message.getMessageStatus();
		try {
			if (MessageStatus.SUCCESS == status) {
				SuccessResult successResult = message.getResult().unpack(SuccessResult.class);
				return successResult.getResult();
			} else {
				FailResult failResult = message.getResult().unpack(FailResult.class);
				String exceptionMessage = getExceptionMessage(failResult);
				String detailMessage = failResult.getDetailMessage();
				throw new BrighticsUncodedException(exceptionMessage, detailMessage);
			}
		} catch (InvalidProtocolBufferException e) {
			throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
		}
	}
	
	private String getExceptionMessage(FailResult failResult) {
		try {
			String errors = failResult.getErrors();
			if (StringUtils.isNotBlank(errors)) {
				BrighticsFunctionException bfe = JsonUtil.fromJson(errors, BrighticsFunctionException.class);
				if (bfe.isParsing) {
					return getFunctionLabelParsedMessage(bfe);
				}
			}
			return failResult.getMessage();
		} catch (Exception e) {
			logger.error("Cannot convert function exception.", e);
			return failResult.getMessage();
		}
	}

	private String getFunctionLabelParsedMessage(BrighticsFunctionException bfe) {
		List<String> exceptionMessages = new ArrayList<>();
		for(brighticsErrorVO brtcError : bfe.brtcErrors){
			String errorCode = brtcError.code;
			String[] params = new String[brtcError.params.length];
			for (int i = 0; i < params.length; i++) {
				params[i] = FunctionPropertiesUtil.getFunctionLabel(bfe.functionName, brtcError.params[i]);
			}
			String exceptionMessage = ExceptionProvider.getExceptionMessage(errorCode);
			if (params == null || params.length == 0) {
				exceptionMessages.add(exceptionMessage);
			} else {
				exceptionMessages.add(String.format(exceptionMessage, (Object[]) params));
			}
		}
		return StringUtils.join(exceptionMessages, ", ");
	}
	
}
