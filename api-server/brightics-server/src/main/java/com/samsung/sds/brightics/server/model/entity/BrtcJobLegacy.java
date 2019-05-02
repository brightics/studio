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
