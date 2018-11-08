package com.samsung.sds.brightics.server.common.message.task;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;

public class TaskMessageRepository {

	private static Map<String, ResultTaskMessage> ResultMessage = new ConcurrentHashMap<String, ResultTaskMessage>();
	private static LoadingCache<String, ResultTaskMessage> cachedMessage = CacheBuilder.newBuilder()
			.expireAfterAccess(1, TimeUnit.MINUTES).build(new CacheLoader<String, ResultTaskMessage>() {
				@Override
				public ResultTaskMessage load(String key) throws Exception {
					return ResultMessage.get(key);
				}
			});

	public static void saveMessageResult(String taskId, ResultTaskMessage message) {
		removeRunningMessage(taskId);
		cachedMessage.put(taskId, message);
	}
	public static ResultTaskMessage getMessageResultAsTaskId(String taskId) {
		return cachedMessage.getIfPresent(taskId);
	}
	public static boolean isExistFinishMessage(String taskId) {
		return cachedMessage.getIfPresent(taskId)!=null;
	}
	
	private static Map<String, ExecuteTaskMessage> runningMessage = new ConcurrentHashMap<String, ExecuteTaskMessage>();
	
	public static void saveRunningMessage(String taskId, ExecuteTaskMessage message) {
		runningMessage.put(taskId, message);
	}
	public static void removeRunningMessage(String taskId) {
		runningMessage.remove(taskId);
	}
	public static boolean isExistRunningMessage(String taskId) {
		return runningMessage.containsKey(taskId);
	}

}
