package com.samsung.sds.brightics.server.common.util.keras.flow;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public abstract class KerasFlowDataNode extends KerasFlowNode {

    protected int index;

    protected JsonArray inputShape;

    public KerasFlowDataNode(String fid, JsonObject function) {
        super(fid, function);
    }

    public abstract void validate() throws BrighticsCoreException;
    public abstract String script(boolean useOnlyFileName) throws Exception;
    public abstract String importScript();

    public JsonArray getInputShape() {
        return inputShape;
    }

    protected void setInputShape() {
        this.inputShape = param.get("input_shape").getAsJsonArray();

        param.remove("input_shape");
    }

    public String getDataVariableName() {
        return makeNameWithIndex("X_train");
    }

    public String getInputLayerName() {
        return makeNameWithIndex("input_layer");
    }

    public String getOutputLayerName() {
        return makeNameWithIndex("output_layer");
    }

    protected String makeNameWithIndex(String baseName) {
        if (index > 1) return baseName + "_" + index;
        else return baseName;
    }

    public int getInputNodeIndex() {
        return index;
    }

    public void setInputNodeIndex(int index) {
        this.index = index;
    }
}
