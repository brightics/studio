package com.samsung.sds.brightics.server.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@Data
@Entity
public class BrighticsAgent {

    @Id
    private String agentId;

    private String agentName;

    @Column(name = "agent_desc")
    private String agentDescription;

    private String agentType;

    private String serverIp;

    private String serverPort;

    @ColumnDefault("'Y'")
    private String useYn;

    private String lastStartTime;

    private String lastStartUser;

    private int cores;

    private int memoryPerNodes;

    @ColumnDefault("0")
    private int maxConcurrentJobs; // 0 is infinite

    @Transient
    private String status; // Filled in Repository
}
