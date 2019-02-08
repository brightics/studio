package com.samsung.sds.brightics.server.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.apache.commons.lang3.RandomStringUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.service.JobService;

@RestController
@RequestMapping("/api/core/v2")
public class JobController {

    @Autowired
    JobService jobService;

    /**
     * GET    /api/core/v2/analytics/jobs                            : JOB 리스트 조회
     * GET    /api/core/v2/analytics/jobs/{jobId}                    : JOB 실행 상태 확인
     * POST   /api/core/v2/analytics/jobs/execute                    : JOB 통합 실행
     * DELETE /api/core/v2/analytics/jobs/{jobId}                    : JOB 중지
     */

    @RequestMapping(value = "/analytics/jobs", method = RequestMethod.GET)
    public List<JobStatusVO> listJobs() {
        return jobService.listJobStatus();
    }

    @RequestMapping(value = "/analytics/jobs/{jobId}", method = RequestMethod.GET)
    public Object getJobStatus(@PathVariable String jobId) {
        return jobService.getJobStatus(jobId);
    }

    @RequestMapping(value = "/analytics/jobs/execute", method = RequestMethod.POST)
    public Map<String, Object> executeJob(
        @Valid @RequestBody JobParam jobParam) {
        jobParam.setUser(AuthenticationUtil.getRequestUserId());
        jobParam.setJid(generateJid());
        return jobService.executeJob(jobParam);
    }

    private String generateJid() {
        return "c_" + RandomStringUtils.randomAlphanumeric(16) + "_" + DateTimeFormat.forPattern("yyyyMMddHHmmssSSSS").print(new DateTime());
    }

    @RequestMapping(value = "/analytics/jobs/{jobId}", method = RequestMethod.DELETE)
    public Map<String, Object> killJob(
        @PathVariable String jobId) {
        return jobService.terminateJob(jobId);
    }
}
