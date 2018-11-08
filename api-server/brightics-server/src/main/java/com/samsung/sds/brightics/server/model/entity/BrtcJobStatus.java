package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@SuppressWarnings("serial")
public class BrtcJobStatus implements Serializable {

    @Id
    private String jobId;

    private String jobBy;

    @Column(name = "executeUser")
    private String user;

    private String modelId;

    private String startTime;

    private String endTime;

    private String modifyTime;

    private String status;

    private String agentId;

    @Column(columnDefinition = "text")
    private String message;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @ColumnDefault("'2017-01-01'")
    private Date createdTime;
}
