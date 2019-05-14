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

import java.util.concurrent.TimeoutException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.context.UserContextSessionLoader;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;

/**
 * The class re package JobRunner, and give required API.
 * 
 * @author hk.im
 *
 */
public class JobRunnerWrapper {

	private static final Logger logger = LoggerFactory.getLogger(JobRunnerWrapper.class);
	private JobRunner jobRunner;
	private int timeoutSecond = Integer.MAX_VALUE;
	private String user = "brightics@samsung.com";

	public JobRunnerWrapper(JobRunner jobRunner) {
		this.jobRunner = jobRunner;
	}

	/**
	 * Set work flow model execute user. 
	 * 
	 * @param user : execute user
	 */
	protected JobRunnerWrapper setProcessName(String processName) {
		this.user = processName;
		return this;
	}
	
	/**
	 * (Optional) Set work flow model timeout second. 
	 * if set 0 second. actual working is integer max. 
	 * 
	 * @param second : timeout second (default integer max)
	 */
	public JobRunnerWrapper setTimeout(int second) {
		if (second == 0) {
			return this;
		}
		timeoutSecond = second;
		return this;
	}

	public String getStatus(){
		return jobRunner.getStatus().getStatus();
	}
	
	/**
	 * Run work flow model and get finish status (SUCCESS, FAIL) .
	 */
	public void run() {
		String jobId = jobRunner.getStatus().getJobId();
		logger.info(String.format("Lightweight job(%s) start in python process(%s).", jobId, user));
		try {
			ThreadLocalContext.put("user", user);
			// start model.
			jobRunner.run();
			// check model status. status contain SUCCESS, FAIL, PROCESS, WAIT.
			// if status is SUCCESS or FAIL, model finished.
			int processSecond = 0;
			while (!(Status.SUCCESS.name().equals(jobRunner.getStatus().getStatus())
					|| Status.FAIL.name().equals(jobRunner.getStatus().getStatus()))) {
				if (processSecond > timeoutSecond) {
					throw new TimeoutException("The working time of the workflow exceeded the standard.");
				}
				Thread.sleep(100);
				processSecond++;
			}
		} catch (Exception e) {
			logger.error("Cannot run work flow model.", e);
			throw new RuntimeException(e);
		} finally {
			// remove userContext
			UserContextSessionLoader.clearUserContextSession(user);
			jobRunner.clear();
			logger.info(String.format("Lightweight job(%s) finish in python process(%s).", jobId, user));
		}
	}

}
