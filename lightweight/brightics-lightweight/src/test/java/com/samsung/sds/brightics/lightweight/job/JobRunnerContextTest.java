package com.samsung.sds.brightics.lightweight.job;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.PreparedDataVO;
import com.samsung.sds.brightics.lightweight.job.JobRunnerContext;
import com.samsung.sds.brightics.lightweight.job.JobRunnerWrapper;

public class JobRunnerContextTest {

    private static final Logger logger = LoggerFactory.getLogger(JobRunnerContextTest.class);

    @Test
    public void executeJobRunnerWrapper() {
        String modelPath = "./model";
        long startTime = System.currentTimeMillis();
        JobRunnerWrapper jobRunner = null;
        try {
            logger.info("Start job runner test.");
            PreparedDataVO preparedDataVO = new PreparedDataVO("mncgdf9y8p7ufkxr", "f3sf9ha4b8zbbny9",
                    "tzurgnab4adkdtve", JsonUtil.jsonToMap(
                    "{\"col_names\":[\"test\",\"test2\"],\"type_array\":[\"int\",\"string\"],\"data_array\":[[\"1\",\"test\"]]}"));
            jobRunner = JobRunnerContext.getInstance().createJobRunnerWithData("proc01",
                    modelPath + "/iris_template.json", preparedDataVO);
            jobRunner.run();

            logger.info("Finish job runner.");
            logger.info(jobRunner.getStatus());
        } catch (Exception e) {
            logger.error("Cannot execute job", e);
        } finally {
            long elapsed = System.currentTimeMillis() - startTime;
            DateFormat df = new SimpleDateFormat("HH 'hours', mm 'mins,' ss 'seconds'");
            df.setTimeZone(TimeZone.getTimeZone("GMT+0"));
            logger.info("Finish job runner. elapsed time : " + df.format(new Date(elapsed)));
        }
    }

    @Test
    public void executeJobRunner() {

        // create job runner context.
        JobRunnerContext jobRunnerContext = JobRunnerContext.getInstance();
        try {
            // Create job runner as model01
            JobRunnerWrapper jobRunner01 = jobRunnerContext.createJobRunner("proc01", "./model/iris_template.json");
            // Set user (default brightics@samsung.com)
            // Set timeout second (default Integer.MAX)
            jobRunner01.setTimeout(10);
            // Run model
            jobRunner01.run();
            // Get result status
            logger.info(String.format("Resut status : %s", jobRunner01.getStatus()));

            // Create job runner as model02
            JobRunnerWrapper jobRunner02 = jobRunnerContext.createJobRunner("proc02", "./model/iris_template.json");
            // Run model
            jobRunner02.run();

        } catch (Exception e) {
            logger.error("Cannot execute job", e);
        }
    }

}
