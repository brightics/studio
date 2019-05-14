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

package com.samsung.sds.brightics.agent.service.task;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.BrighticsAgent;

public class RunningTasks {
	
	private static final Logger logger = LoggerFactory.getLogger(RunningTasks.class);
	
	private static Map<String, ThreadGroup> tasks = new ConcurrentHashMap<>();
	
	public static void add(String taskId, ThreadGroup tg) {
		tasks.put(taskId, tg);
	}

	public static void complete(String taskId) {
		BrighticsAgent.listener.onCompleted(taskId);
		tasks.remove(taskId);
	}

	public static void interrupt(String taskId) {
		try {
			if (tasks.containsKey(taskId)) {
				ThreadGroup tg = tasks.get(taskId);
				if (tg != null) {
					tg.interrupt();
				}
			}
		} catch (Exception e) {
			logger.error(String.format("Error occurs while interrupting a thread [%s]", taskId));
		} finally {
			complete(taskId);
		}
	}

	public static boolean contains(String taskId) {
		return tasks.containsKey(taskId);
	}

	public static ArrayList<String> listTasks() {
		Set<String> keySet = tasks.keySet();
		return new ArrayList<String>(keySet);
	}

	public static int count() {
		return tasks.size();
	}
	

}
