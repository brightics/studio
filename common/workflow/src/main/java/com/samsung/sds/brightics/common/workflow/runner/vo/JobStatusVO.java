package com.samsung.sds.brightics.common.workflow.runner.vo;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

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
    private List<Object> errorInfo;

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
}
