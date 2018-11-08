package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
@SuppressWarnings("serial")
public class BrtcJobStatusError implements Serializable {

    @Id
    private String jobId;

    @Column(columnDefinition = "text")
    private String message;

    @Column(columnDefinition = "text")
    private String contents;

    private String functionName;

    private String modelId;
}
