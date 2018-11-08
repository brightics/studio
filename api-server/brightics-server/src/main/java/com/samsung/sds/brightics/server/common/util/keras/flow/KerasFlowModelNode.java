package com.samsung.sds.brightics.server.common.util.keras.flow;

import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;

public class KerasFlowModelNode extends KerasFlowNode {

    public KerasFlowModelNode(String fid, JsonObject function) {
        super(fid, function);
    }

    public boolean hasScript() {
        return containsStringParam("script");
    }

    public String getScript() {
        if (!hasScript()) {
            return StringUtils.EMPTY;
        }

        return LINE_SEPARATOR + param.get("script").getAsString() + LINE_SEPARATOR;
    }
}
