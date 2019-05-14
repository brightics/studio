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

package com.samsung.sds.brightics.server.common.thread;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;

public abstract class JobModelRunnable implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(JobModelRunnable.class);
    private String id;
    private JobParam jobParam;
    private boolean active = true;
    private JobStatusVO status;

    public JobModelRunnable(JobParam jobParam2, JobStatusVO jobStatusVO) {
        if (jobParam2 == null || StringUtils.isEmpty(jobParam2.getJid())) {
            throw new IllegalArgumentException("Invalid jobParam - " + jobParam2);
        }
        this.id = jobParam2.getJid();
        this.jobParam = jobParam2;
        this.status = jobStatusVO;
    }

    public abstract void main() throws Exception;

    public JobParam getJobParam() {
        return this.jobParam;
    }

    public String getId() {
        return this.id;
    }

    public boolean isActive() {
        return this.active;
    }

    public JobStatusVO getStatus() {
        return this.status;
    }

    public void run() {
        try {
            main();
        } catch (InterruptedException e) {
            LOGGER.warn("Running flow jobId[{}] is interrupted.", this.id);
        } catch (Exception e) {
            LOGGER.error("Error while running job model[" + this.id + "].", e);
        } finally {
            deactivate();
        }
    }

    public void deactivate() {
        this.active = false;
    }
}