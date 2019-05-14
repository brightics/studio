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

import javax.persistence.Entity;
import javax.persistence.Id;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.samsung.sds.brightics.common.core.util.JsonUtil;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
public class BrtcDatasources implements Serializable {

    @Id
    private String datasourceName;

    //support old version.
    @Deprecated
    @ColumnDefault("'RDB'")
    private String datasourceType;

    //support old version.
    @Deprecated
    @JsonIgnore
    private String datasourceParam;

    @ColumnDefault("false")
    private boolean deploy;
    private String ip;
    private String port;
    private String userName;
    private String password;
    private String dbType;
    private String dbName;

    public boolean isDeploy() {
        if (StringUtils.isNotEmpty(datasourceType)
                && "DEPLOY".equals(datasourceType)) {
            return true;
        }
        return deploy;
    }

    public String getIp() {
        if (StringUtils.isEmpty(ip) && StringUtils.isNotEmpty(datasourceParam)) {
            this.ip = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("ip", ""));
        }
        return ip;
    }

    public String getPort() {
        if (StringUtils.isEmpty(port) && StringUtils.isNotEmpty(datasourceParam)) {
            this.port = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("port", ""));
        }
        return port;
    }

    public String getUserName() {
        if (StringUtils.isEmpty(userName) && StringUtils.isNotEmpty(datasourceParam)) {
            this.userName = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("username", ""));
        }
        return userName;
    }

    public String getPassword() {
        if (StringUtils.isEmpty(password) && StringUtils.isNotEmpty(datasourceParam)) {
            this.password = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("password", ""));
        }
        return password;
    }

    public String getDbType() {
        if (StringUtils.isEmpty(dbType) && StringUtils.isNotEmpty(datasourceParam)) {
            this.dbType = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("db-type", "postgre"));
        }
        return dbType;
    }

    public String getDbName() {
        if (StringUtils.isEmpty(dbName) && StringUtils.isNotEmpty(datasourceParam)) {
            this.dbName = String.valueOf(JsonUtil.jsonToParam(datasourceParam).getOrDefault("db-name", ""));
        }
        return dbName;
    }

}
