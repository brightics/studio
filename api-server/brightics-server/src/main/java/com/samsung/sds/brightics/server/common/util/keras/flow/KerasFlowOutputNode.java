package com.samsung.sds.brightics.server.common.util.keras.flow;

import java.util.Map;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public class KerasFlowOutputNode extends KerasFlowNode {

    private KerasFlowDataNode trainData;
    private KerasFlowDataNode validationData;

    public KerasFlowOutputNode(String fid, JsonObject function) {
        super(fid, function);
    }

    public void validate(Map<String, KerasFlowNode> allNodes) {
        if (!containsStringParam("train_data")) {
            throw new BrighticsCoreException("4411", "Output activity", "Train Data");
        }

        validatePairInputActivity(allNodes, getTrainDataFid(), "Train Data");
        setTrainData((KerasFlowDataNode) allNodes.get(getTrainDataFid()));

        if (containsStringParam("validation_data")) {
            validatePairInputActivity(allNodes, getValidationDataFid(), "Validation Data");
            setValidationData((KerasFlowDataNode) allNodes.get(getValidationDataFid()));
        }
    }

    private void validatePairInputActivity(Map<String, KerasFlowNode> allNodes, String pairFid, String name) {
        if (!allNodes.containsKey(pairFid)) {
            throw new BrighticsCoreException("4412", pairFid, name);
        }

        KerasFlowNode pairInput = allNodes.get(pairFid);
        if (!(pairInput instanceof KerasFlowDataNode)) {
            throw new BrighticsCoreException("4413", name);
        }
    }

    public String getTrainDataFid() {
        return param.get("train_data").getAsString();
    }

    public String getValidationDataFid() {
        return param.get("validation_data").getAsString();
    }

    public KerasFlowDataNode getTrainDataNode() {
        return trainData;
    }

    public void setTrainData(KerasFlowDataNode trainData) {
        this.trainData = trainData;
    }

    public KerasFlowDataNode getValidationDataNode() {
        return validationData;
    }

    public void setValidationData(KerasFlowDataNode validationData) {
        this.validationData = validationData;
    }

    public String getLoss() {
        return param.get("loss").getAsString();
    }

    public String getMetrics() {
        return param.get("metrics").getAsString();
    }
}
