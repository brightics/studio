package com.samsung.sds.brightics.common.workflow.flowrunner;

import java.util.concurrent.ConcurrentHashMap;

public class JobRunnerConfig {

	private ConcurrentHashMap<String, String> setting = new ConcurrentHashMap<>();

	// default values
	private String variableRepo = "./variables";
	private String isPersistForcedFalse = "false";
	private String isUserVariableBackup = "true";

	public JobRunnerConfig set(String key, String value) {
		setting.put(key, value);
		return this;
	}

	/**
	 * set variable repository path. (default : ./variable)
	 * 
	 * @param path
	 */
	public JobRunnerConfig setVariableRepositoryPath(String path) {
		setting.put("flowrunner.variable.repo", path);
		return this;
	}

	public String getVariableRepositoryPath() {
		return setting.getOrDefault("flowrunner.variable.repo", variableRepo);
	}

	/**
	 * If true, set the persist option of all jobs to false. (default : false)
	 * 
	 * @param isPersist
	 */
	public JobRunnerConfig setPersistForcedFalse(Boolean isPersist) {
		setting.put("flowrunner.persist.forced.false", String.valueOf(isPersist));
		return this;
	}

	public Boolean getPersistForcedFalse() {
		return Boolean.valueOf(setting.getOrDefault("flowrunner.persist.forced.false", isPersistForcedFalse));
	}

	/**
	 * If true, backup user variable in local file (default : true)
	 * 
	 * @param isPersist
	 */
	public JobRunnerConfig setUserVariableBackup(Boolean isBackup) {
		setting.put("flowrunner.user.variable.backup", String.valueOf(isBackup));
		return this;
	}
	
	public Boolean getUserVariableBackup() {
		return Boolean.valueOf(setting.getOrDefault("flowrunner.user.variable.backup", isUserVariableBackup));
	}

}
