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

import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.util.keras.PythonScriptUtil;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasLayers;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameterConstant;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class KerasFlowLayerNode extends KerasFlowModelNode {

    protected final KerasLayers layer;

    private KerasFlowDataNode dataNode;
    private KerasFlowOutputNode outputNode;

    private int index = -1;

    public KerasFlowLayerNode(String fid, JsonObject function) {
        super(fid, function);

        this.layer = KerasLayers.of(operation);

        this.layer.validate(getParam());
    }

    public KerasLayers getLayer() {
        return layer;
    }

    public KerasFlowDataNode getDataNode() {
        return dataNode;
    }

    public void setDataNode(KerasFlowDataNode dataNode) {
        this.dataNode = dataNode;
    }

    public KerasFlowOutputNode getOutputNode() {
        return outputNode;
    }

    public void setOutputNode(KerasFlowOutputNode outputNode) {
        this.outputNode = outputNode;
    }

    public int getNodeIndex() {
        return this.index;
    }

    public void setNodeIndex(int index) {
        this.index = index;
    }

    public boolean isFirstLayer() {
        return dataNode != null;
    }

    public boolean isLastLayer() {
        return outputNode != null;
    }

    public boolean isApplications() {
        return layer.isApplications();
    }

    public String getInputShape() throws Exception {
        try {
            return KerasParameterConstant.INPUT_SHAPE.getType().script(dataNode.getInputShape());
        } catch (Exception e) {
            throw new Exception(String.format(e.getMessage(), "Input shape"));
        }
    }

    public String getInputLayerName() {
        if (isFirstLayer()) {
            return dataNode.getInputLayerName();
        }

        return StringUtils.EMPTY;
    }

    public String getOutputLayerName() {
        if (isLastLayer()) {
            return outputNode.getTrainDataNode().getOutputLayerName();
        }

        return StringUtils.EMPTY;
    }

    public String getVariableName() {
        if (isLastLayer()) {
            return getOutputLayerName();
        } else if (isFirstLayer()) {
            if (isApplications()) {
                return getInputLayerName();
            } else {
                return dataNode.makeNameWithIndex("x");
            }
        } else {
            return makeVariableName();
        }
    }

    private String makeVariableName() {
        String name = getPrevVariableName(prevNodes.get(0));

        if (StringUtils.endsWith(name, ".output")) {
            name = StringUtils.substringBeforeLast(name, ".output");
        }

        if (StringUtils.startsWith(name, "input_layer")) {
            String suffix = StringUtils.substringAfter(name, "input_layer");

            if (StringUtils.isBlank(suffix)) {
                name = "x";
            } else {
                name = "x" + suffix;
            }
        }

        if (this.index > 1) {
            name += "_" + index;
        }

        return name;
    }

    public String getPrevVariableName() {
        String prefix = StringUtils.EMPTY;
        String suffix = StringUtils.EMPTY;

        if (prevNodes.size() > 1) {
            prefix = "[";
            suffix = "]";
        }

        return prevNodes.stream().map(this::getPrevVariableName).collect(Collectors.joining(", ", prefix, suffix));
    }

    private String getPrevVariableName(KerasFlowNode node) {
        if (node instanceof KerasFlowLayerNode) {
            if (((KerasFlowLayerNode) node).isApplications() && ((KerasFlowLayerNode) node).isFirstLayer()) {
                return ((KerasFlowLayerNode) node).getVariableName() + ".output";
            }
            return ((KerasFlowLayerNode) node).getVariableName();
        }

        if (node instanceof KerasFlowDataNode) return ((KerasFlowDataNode) node).getInputLayerName();

        return node.getPrevNodes().stream().map(this::getPrevVariableName).collect(Collectors.joining(","));
    }

    public String getLayerScript() {
        return getLayerScript(false);
    }

    public String getLayerScript(boolean inputShape) {
        return layer.getLayerScript(getParam(inputShape));
    }

    protected JsonObject getParam(boolean inputShape) {
        if (inputShape) {
            if (!isFirstLayer() || PythonScriptUtil.isJsonElementBlank(dataNode.getInputShape())) {
                throw new BrighticsCoreException("3109", "Input Shape");
            }

            return JsonParamUtil.mergeParam(param, "input_shape", dataNode.getInputShape());
        } else if (isLastLayer()) {
            KerasFlowDataNode dataNode = getOutputNode().getTrainDataNode();
            String outputLayerName = dataNode.getOutputLayerName();

            return JsonParamUtil.mergeParam(param, "name", outputLayerName);
        }

        return param;
    }
}

class JsonParamUtil {

    static JsonObject mergeParam(JsonObject param, String name, String value) {
        JsonObject newParam = (JsonObject) deepCopy(param);

        newParam.addProperty(name, value);

        return newParam;
    }

    static JsonObject mergeParam(JsonObject param, String name, JsonElement value) {
        JsonObject newParam = (JsonObject) deepCopy(param);

        newParam.add(name, value);

        return newParam;
    }

    private static JsonElement deepCopy(JsonElement element) {
        if (element.isJsonArray()) {
            JsonArray result = new JsonArray();
            for (JsonElement elem : element.getAsJsonArray()) {
                result.add(deepCopy(elem));
            }
            return result;
        }

        if (element.isJsonObject()) {
            JsonObject result = new JsonObject();
            for (Entry<String, JsonElement> entry : ((JsonObject) element).entrySet()) {
                result.add(entry.getKey(), deepCopy(entry.getValue()));
            }
            return result;
        }

        return element;
    }
}
