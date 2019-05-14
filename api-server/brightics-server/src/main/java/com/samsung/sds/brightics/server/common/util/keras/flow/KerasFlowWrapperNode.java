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

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasLayers;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;

/**
 * For Layers have inner layer as listed below
 *   * RNN
 *   * TimeDistributed
 *   * Bidirectional
 */
public class KerasFlowWrapperNode extends KerasFlowLayerNode {

    private JsonObject innerObject;
    private String innerOperation;
    private JsonObject innerParam;

    private KerasLayers innerLayer = null;

    public KerasFlowWrapperNode(String fid, JsonObject function, String innerObjectKey) {
        super(fid, function);

        this.innerObject = param.getAsJsonObject(innerObjectKey);
        this.innerOperation = innerObject.get("name").getAsString();
        this.innerParam = innerObject.getAsJsonObject("param");

        if ("Custom".equalsIgnoreCase(innerOperation)) {
            param.addProperty(innerObjectKey, innerParam.get("function").getAsString());
        } else {
            innerLayer = KerasLayers.of(innerOperation);
            param.addProperty(innerObjectKey, innerLayer.getLayerScript(innerParam));
        }
    }

    public boolean hasScript() {
        return innerParam.get("script") != null && StringUtils.isNotBlank(innerParam.get("script").getAsString());
    }

    public String getScript() {
        if (!hasScript()) {
            return StringUtils.EMPTY;
        }

        return LINE_SEPARATOR + innerParam.get("script").getAsString() + LINE_SEPARATOR;
    }

    public Optional<KerasLayers> getInnerLayer() {
        return Optional.ofNullable(this.innerLayer);
    }
}
