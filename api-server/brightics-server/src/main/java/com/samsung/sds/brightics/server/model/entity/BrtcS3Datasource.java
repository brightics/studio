package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
@Table(name="brtc_s3_datasource")
public class BrtcS3Datasource implements Serializable {

    @Id
    @NotEmpty
    private String datasourceName;

    private String accessKeyId;
    private String secretAccessKey;
    private String bucketName;

}
