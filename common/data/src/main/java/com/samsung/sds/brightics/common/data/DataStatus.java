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
