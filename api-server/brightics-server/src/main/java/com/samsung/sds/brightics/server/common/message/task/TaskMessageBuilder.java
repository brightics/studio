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

package com.samsung.sds.brightics.server.common.message.task;

import org.apache.commons.lang3.StringUtils;

import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.Builder;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;

public class TaskMessageBuilder {

    private String taskId;
    private String name;
    private String parameters;
    private String attributes;

    public static TaskMessageBuilder newBuilder(String taskId, String name) {
        return new TaskMessageBuilder(taskId, name);
    }

    public TaskMessageBuilder(String taskId, String name) {
        this.taskId = taskId;
        this.name = name;
    }

    public TaskMessageBuilder setParameters(String parameters) {
        this.parameters = parameters;
        return this;
    }

    public TaskMessageBuilder setAttributes(String attributes) {
        this.attributes = attributes;
        return this;
    }

    public ExecuteTaskMessage build() {
        Builder builder = ExecuteTaskMessage.newBuilder().setName(name).setTaskId(taskId)
                .setUser(AuthenticationUtil.getRequestUserId());
        if (StringUtils.isNoneBlank(parameters)) {
            builder.setParameters(parameters);
        } else {
            builder.setParameters("{}");
        }

        if (StringUtils.isNoneBlank(attributes)) {
            builder.setAttributes(attributes);
        } else {
            builder.setAttributes("{}");
        }
        return builder.build();
    }
}
