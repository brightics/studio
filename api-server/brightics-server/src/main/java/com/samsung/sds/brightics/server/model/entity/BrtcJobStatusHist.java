package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

import lombok.Data;

@Data
@Entity
@SuppressWarnings("serial")
@IdClass(BrtcJobStatusHistPk.class)
public class BrtcJobStatusHist implements Serializable {

    @Id
    private String jobId;

    private String jobBy;

    @Column(name = "executeUser")
    private String user;

    private String modelId;

    private String startTime;

    private String endTime;

    @Id
    private String modifyTime;

    private String status;

    private String agentId;

    @Column(columnDefinition = "text")
    private String message;
}
