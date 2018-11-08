package com.samsung.sds.brightics.common.variable;

import com.google.gson.JsonElement;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Variable {

    private String name;
    private JsonElement value;

    public String getExecutableScriptString() {
        StringBuilder sb = new StringBuilder();
        sb.append("var ").append(this.name).append("=").append(value.toString());
        return sb.toString();
    }
}
