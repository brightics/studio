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
