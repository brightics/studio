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
        return build(AuthenticationUtil.getRequestUserId());
    }
    
    public ExecuteTaskMessage build(String user) {
    	Builder builder = ExecuteTaskMessage.newBuilder().setName(name).setTaskId(taskId)
    			.setUser(user);
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
