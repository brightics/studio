package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Transient;
import lombok.Data;

@Data
@Entity
@IdClass(BrtcJobLegacyPk.class)
public class BrtcJobLegacy implements Serializable {
    @Transient
    public static final String TYPE_MODEL = "BrtcJobModel";
    @Transient
    public static final String TYPE_DEPLOY = "BrtcDeployModel";
    @Transient
    public static final String TYPE_SCHEDULE = "BrtcSchedule";

    @Id
    @Column(nullable = false)
    private String type;

    @Id
    @Column(nullable = false)
    private String legacyId;

    @Column(columnDefinition = "text", nullable = false)
    private String contents;
}
