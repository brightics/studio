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

package com.samsung.sds.brightics.common.data;

import java.io.Serializable;
import java.util.Properties;

import com.samsung.sds.brightics.common.core.acl.Permission;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;
import com.samsung.sds.brightics.common.network.proto.ContextType;

import lombok.ToString;

@ToString
public class DataStatus implements Serializable {

    private static final long serialVersionUID = -191643642119818895L;

    private DataStatus() { /* empty constructor for ObjectMapper deserialization */ }

    public DataStatus(String typeName, ContextType contextType) {
        this(typeName, System.currentTimeMillis(), contextType, Permission.PUBLIC, null);
    }

    public DataStatus(String typeName, long createdTime, ContextType contextType, Permission acl,
        Properties extraProperties) {
        this();
        this.typeName = typeName;
        this.createdTime = createdTime;
        this.contextType = contextType;
        this.acl = acl;
        this.extraProperties = extraProperties;
    }

    public String key;
    public String path;
    public String label;
    public String typeName;
    public long createdTime;
    public ContextType contextType;
    public Permission acl;
    public Properties extraProperties;

    @SuppressWarnings("unused")
    public String toJson() {
        return BrighticsGsonBuilder.getGsonInstance().toJson(this);
    }

    public void copyPreservedProperties(DataStatus from) {
        this.label = from.label;
        this.createdTime = from.createdTime;
        this.acl = from.acl;
        this.extraProperties = from.extraProperties;
    }
}
