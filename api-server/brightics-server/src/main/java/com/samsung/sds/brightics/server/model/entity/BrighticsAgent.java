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
