package com.samsung.sds.brightics.common.workflow.runner;

import java.util.concurrent.ConcurrentHashMap;

public class JobRunnerConfig {

	private ConcurrentHashMap<String, String> setting = new ConcurrentHashMap<>();

	// default values
	private String variableRepo = "./variable";

	public JobRunnerConfig set(String key, String value) {
		setting.put(key, value);
		return this;
	}

	public JobRunnerConfig setVariableRepositoryPath(String path) {
		setting.put("flowrunner.variable.repo", path);
		return this;
	}

	public String getVariableRepositoryPath() {
		return setting.getOrDefault("flowrunner.variable.repo", variableRepo);
	}
	
	

}
