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
