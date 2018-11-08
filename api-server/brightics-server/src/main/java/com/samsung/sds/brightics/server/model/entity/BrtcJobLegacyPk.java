package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;
import lombok.Data;

@Data
public class BrtcJobLegacyPk implements Serializable {
    private String type;
    private String legacyId;
}
