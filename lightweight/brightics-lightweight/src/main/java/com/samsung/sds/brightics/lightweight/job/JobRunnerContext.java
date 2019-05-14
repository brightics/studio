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

package com.samsung.sds.brightics.lightweight.job;

import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerConfig;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.PreparedDataVO;

/**
 * The class which creates job runner for lightweight analysis. This class
 * constructs a single instance JobRunnerBuilder and creates a job runner using
 * model information(file or json string).
 * 
 * @author hk.im
 *
 */
public class JobRunnerContext {

	private static JobRunnerContext instance;

	public static synchronized JobRunnerContext getInstance() {
		if (instance == null)
			instance = new JobRunnerContext();
		return instance;
	}

	private JobRunnerBuilder jobRunnerBuilder;

	private JobRunnerContext() {

		// init application env
		autoConfigurer();

		// initialize job runner API, configuration.
		JobRunnerConfig config = new JobRunnerConfig();
		boolean isForcedNotPersist = Boolean.parseBoolean(
				SystemEnvUtil.getEnvOrPropOrElse("FORCED_UNPERSIST", "brightics.lightweight.forced.unpersist", "true"));
		config.setPersistForcedFalse(isForcedNotPersist);
		config.setUserVariableBackup(false);

		// build job runner builder
		if (jobRunnerBuilder == null) {
			jobRunnerBuilder = JobRunnerBuilder.builder().config(config).jobRunnerApi(new LightweightJobRunnerApi());
		}
		
		Runtime.getRuntime().addShutdownHook(new Thread("brightics-lightweight-shutdownHook") {
            @Override
            public void run() {
            	ContextManager.close();
            }
        });
	}

	/**
	 * create JobRnnner which contain model.
	 * @param pythonProcessName : Set the python process name to be executed.
	 * @param modelFilePath : runnable model json file path. 
	 */
	public JobRunnerWrapper createJobRunner(String pythonProcessName, String modelFilePath) throws Exception {
		return createJobRunnerWithEventLoadData(pythonProcessName, modelFilePath, null);
	}

	/**
	 * create JobRnnner which contain model and EventLoad data set.
	 */
	public JobRunnerWrapper createJobRunnerWithEventLoadData(String pythonProcessName, String modelFilePath,
			String eventloadData) throws Exception {
		String modelJsonString = FileUtils.readFileToString(new File(modelFilePath));
		return createJobRunnerWithJsonString(pythonProcessName, modelJsonString, eventloadData);
	}

	/**
	 * create JobRnnner which contain json string model and EventLoad data set.
	 */
	private JobRunnerWrapper createJobRunnerWithJsonString(String pythonProcessName, String modelJsonString,
			String eventloadData) throws Exception {
		JobParam jobParam = convertStringToJobParam(modelJsonString);
		if (eventloadData != null && !eventloadData.isEmpty()) {
			List<PreparedDataVO> preparedDatas = new ArrayList<>();
			JsonArray dataArray = JsonUtil.fromJson(eventloadData, JsonArray.class);
			for (JsonElement dataElm : dataArray) {
				preparedDatas.add(JsonUtil.fromJson(dataElm, PreparedDataVO.class));
			}
			jobParam.setDatas(preparedDatas);
		}
		jobParam.setUser(pythonProcessName);
		jobParam.setJid(generateJid());
		return new JobRunnerWrapper(jobRunnerBuilder.create(jobParam)).setProcessName(pythonProcessName);
	}

	private String generateJid() {
		return "c_" + RandomStringUtils.randomAlphanumeric(16) + "_"
				+ DateTimeFormat.forPattern("yyyyMMddHHmmssSSSS").print(new DateTime());
	}

	private JobParam convertStringToJobParam(String jsonString) throws Exception {
		return new ObjectMapper().readValue(jsonString, JobParam.class);
	}

	private static void autoConfigurer() {
		System.setProperty("brightics.agent.home", getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME));
		System.setProperty("brightics.function.home",
				getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME, "functions"));
		System.setProperty("brightics.data.root", getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME, "data"));
		System.setProperty("brightics.kv.store", "INMEMORY");
		System.setProperty("brightics.grpc.mode", "local");
		System.setProperty("brightics.agent.host", "localhost"); // do nothing
		System.setProperty("brightics.server.host", "localhost"); // do nothing
		System.setProperty("brightics.server.port", "9098"); // do nothing
		System.setProperty("brightics.agent.idleTimeMin", "0"); // do nothing
		SystemEnvUtil.refresh();
	}

	private static String getAbsolutePath(String first, String... more) {
		String absPath = Paths.get(first, more).normalize().toAbsolutePath().toUri().getPath().replaceAll("/$", "");
		if (absPath.matches("^/.+:/.*")) {
			// remove first slash when path contains windows disk name
			absPath = absPath.substring(1);
		}
		return absPath;
	}

}
