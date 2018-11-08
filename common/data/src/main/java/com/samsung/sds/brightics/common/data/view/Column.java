package com.samsung.sds.brightics.common.data.view;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

public class Column implements Serializable {

    private static final long serialVersionUID = -8179693720757921961L;

    @SerializedName("column-name")
    String columnName;
    @SerializedName("column-type")
    String columnType;

    @JsonCreator
    public Column(@JsonProperty("column-name") String columnName, @JsonProperty("column-type") String columnType) {
        super();
        this.columnName = columnName;
        this.columnType = columnType;
    }

    @JsonProperty("column-name")
    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    @JsonProperty("column-type")
    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }
}
