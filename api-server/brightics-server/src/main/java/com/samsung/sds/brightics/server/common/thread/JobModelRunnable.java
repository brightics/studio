package com.samsung.sds.brightics.server.common.thread;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.server.model.param.JobParam;
import com.samsung.sds.brightics.server.model.vo.JobStatusVO;

public abstract class JobModelRunnable implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(JobModelRunnable.class);
    private String id;
    private JobParam jobParam;
    private boolean active = true;
    private JobStatusVO status;

    public JobModelRunnable(JobParam jobParam, JobStatusVO status) {
        if (jobParam == null || StringUtils.isEmpty(jobParam.getJid())) {
            throw new IllegalArgumentException("Invalid jobParam - " + jobParam);
        }
        this.id = jobParam.getJid();
        this.jobParam = jobParam;
        this.status = status;
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
