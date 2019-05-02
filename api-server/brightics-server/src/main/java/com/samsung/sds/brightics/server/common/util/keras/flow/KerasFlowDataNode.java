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
