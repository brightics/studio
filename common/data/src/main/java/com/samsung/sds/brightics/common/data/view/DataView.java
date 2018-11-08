package com.samsung.sds.brightics.common.data.view;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DataView<T> implements Serializable {

    private static final long serialVersionUID = -4841483360789966177L;

    protected String type;
    protected T data;

    public DataView(String type) {
        this.type = type;
    }

    @JsonCreator
    public DataView(@JsonProperty("type") String type, @JsonProperty("data") T data) {
        this.type = type;
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public T getData() {
        return this.data;
    }
}
