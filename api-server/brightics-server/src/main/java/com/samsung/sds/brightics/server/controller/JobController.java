package com.samsung.sds.brightics.server.controller;

import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.model.param.JobParam;
import com.samsung.sds.brightics.server.model.vo.JobStatusVO;
import com.samsung.sds.brightics.server.service.JobService;
import org.apache.commons.lang3.RandomStringUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

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

    /**
     * These two methods are temporarily called by VA for the compatibility with older versions.
     *
     * POST		/api/v2/convert/store    							: store spec Json convert
     * POST		/api/v2/convert/execute  							: execute spec Json conve
     */
    @RequestMapping(value = "/convert/store", method = RequestMethod.POST)
    public String storeJsonConvert(@RequestBody String body) {
        return body;
    }


    @RequestMapping(value = "/convert/execute", method = RequestMethod.POST)
    public String excuteJsonConvert(@RequestBody String body) {
        return body;
    }
}
