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

package com.samsung.sds.brightics.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.service.JobStatusService;

@RestController
@RequestMapping("/api/core/v2")
public class JobStatusController {

    @Autowired
    private JobStatusService jobStatusService;

    /**
     * GET    /api/core/v2/jobstatuslist                  : get job status
     * GET    /api/core/v2/jobstatus/{jobId}              : get job status info
     * GET    /api/core/v2/jobstatushists                 : get job status history (hide)
     * GET    /api/core/v2/jobstatushist/{jobId}          : get job status history info
     * GET    /api/core/v2/jobmodels                      : get job model (hide)
     * GET    /api/core/v2/jobmodel/{modelId}             : get job model info
     * GET    /api/core/v2/jobstatuserrors                : get job status error (hide)
     * GET    /api/core/v2/jobstatuserror/{jobId}         : get job status error info
     * GET    /api/core/v2/joberrormodel/execute/{jobId}  : get job status error info
     *
     * GET    /api/core/v2/joblist/{userId}/{main}        : get job list as user & main (hide)
     */

    @RequestMapping(value = "/jobstatuslist", method = RequestMethod.GET)
    public Object getJobStatusList() {
        return jobStatusService.getJobStatusList();
    }

    @RequestMapping(value = "/jobstatus/{jobId}", method = RequestMethod.GET)
    public Object getJobStatusInfo(@PathVariable String jobId) {
        return jobStatusService.getJobStatus(jobId);
    }

    @RequestMapping(value = "/jobstatushists", method = RequestMethod.GET)
    public Object getJobStatusHistList() {
        return jobStatusService.getJobStatusHistList();
    }

    @RequestMapping(value = "/jobstatushist/{jobId}", method = RequestMethod.GET)
    public Object getJobStatusHistInfo(@PathVariable String jobId) {
        return jobStatusService.getJobStatusHistInfo(jobId);
    }

    @RequestMapping(value = "/jobmodels", method = RequestMethod.GET)
    public Object getJobModelList() {
        return jobStatusService.getJobModelList();
    }

    @RequestMapping(value = "/jobmodel/{modelId}", method = RequestMethod.GET)
    public Object getJobModelInfo(@PathVariable String modelId) {
        return jobStatusService.getJobModelInfo(modelId);
    }

    @RequestMapping(value = "/jobstatuserrors", method = RequestMethod.GET)
    public Object getJobStatusErrorList() {
        return jobStatusService.getJobStatusErrorList();
    }

    @RequestMapping(value = "/jobstatuserror/{jobId}", method = RequestMethod.GET)
    public Object getJobStatusErrorInfo(@PathVariable String jobId) {
        return jobStatusService.getJobStatusErrorInfo(jobId);
    }

    @RequestMapping(value = "/joberrormodel/execute/{jobId}", method = RequestMethod.GET)
    public Object getJobErrorExecute(@PathVariable String jobId) {
        return jobStatusService.executeJobErrorModel(jobId);
    }

    @RequestMapping(value = "/joblist/{userId:.+}/{main}", method = RequestMethod.GET)
    public Object getJobListAsUserAndMain(@PathVariable String userId, @PathVariable String main) {
        return jobStatusService.getJobListByUserAndMain(userId, main);
    }
}
