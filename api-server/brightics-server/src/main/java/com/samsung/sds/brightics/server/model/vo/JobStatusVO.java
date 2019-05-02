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

package com.samsung.sds.brightics.server.model.vo;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class JobStatusVO {

    private String jobId;
    private String user;
    private String status;

    @JsonIgnore
    private String errorFunctionName;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private long begin;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private long end;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<ExceptionInfoVO> errorInfo;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<JobModelStatusVO> processes;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String type;

    @JsonIgnore
    private String errorMessage;

    @JsonIgnore
    private String errorDetailMessage;

    @JsonIgnore
    private String queueName;

    @JsonIgnore
    private int queuePosition;

    public List<JobModelStatusVO> getProcesses() {
        if (processes == null) {
            processes = new ArrayList<>();
        }
        return processes;
    }

    public void setErrorFunctionName(String func) {
        if (StringUtils.isNotEmpty(errorFunctionName)) {
            //if job type is control flow, append control flow function name
            Object[] array = {this.errorFunctionName, func};
            this.errorFunctionName = String.format("%s (%s)", array);
        } else {
            this.errorFunctionName = func;
        }
    }

    public void setBegin(long begin) {
        this.begin = begin;
        this.end = -1;
    }

    public void setEnd(long end) {
        if (this.begin == -1) {
            this.begin = end;
        }
        this.end = end;
    }

    @SuppressWarnings("unused")
    public String getPendingStatus() {
        if (!JobRepository.STATE_WAITING.equals(status) || StringUtils.isEmpty(queueName)) {
            return "";
        }
        return String.format("pending in %s job queue(#%d)", queueName, queuePosition);
    }
}
