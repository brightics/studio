package com.samsung.sds.brightics.server.common.util.keras;

import java.util.HashMap;
import java.util.List;
import java.util.StringJoiner;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataIDGNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowOutputNode;

public abstract class KerasModelScriptGenerator {

    protected StringJoiner script = new StringJoiner(System.lineSeparator());

    String jid;

    JsonObject param;

    KerasModelFlow modelFlowData;

    public KerasModelScriptGenerator(JsonObject model) throws Exception {
        this(model, StringUtils.EMPTY);
    }

    public KerasModelScriptGenerator(JsonObject model, String jid) throws Exception {
        this.jid = jid;

        extractCommonDatas(model);
        extractValidLayersDatas(model);
    }

    private void extractCommonDatas(JsonObject model) {
        this.param = model.getAsJsonObject("param");
    }

    private void extractValidLayersDatas(JsonObject model) throws Exception {
        JsonArray functions = model.getAsJsonArray("functions");
        JsonArray links = model.getAsJsonArray("links");

        validateModelBasicRule(functions, links);

        modelFlowData = new KerasModelFlow(links, getFunctionsFidMap(functions));
    }

    private void validateModelBasicRule(JsonArray functions, JsonArray links) throws Exception {
        if (functions.size() == 0) {
            throw new Exception("Empty model cannot be executed. Deep learning model requires DL Load activity and one or more layer activity at least");
        }

        if (functions.size() == 1) {
            throw new Exception("Deep learning model requires DL Load activity and one or more layer activity at least");
        }

        if (links.size() == 0) {
            throw new Exception("Incorrect model cannot be executed. All the activities should be connected with each other");
        }
    }

    private HashMap<String, JsonObject> getFunctionsFidMap(JsonArray functions) {
        HashMap<String, JsonObject> functionsMap = new HashMap<>();
        for (JsonElement f : functions) {
            JsonObject function = f.getAsJsonObject();
            String fid = function.get("fid").getAsString();

            functionsMap.put(fid, function);
        }
        return functionsMap;
    }

    public String getSequentialScript() throws Exception {
        clearScript();

        addSequentialImport();
        addLayersImport();

        addDataLoad();

        addSequentialModel();

        addGenerationModeSpecificScript();

        // TODO: replace variables

        return script.toString();
    }

    public String getFunctionalScript() throws Exception {
        clearScript();

        addFunctionalImport();
        addLayersImport();

        addDataLoad();

        addFunctionalModel();

        addGenerationModeSpecificScript();

        // TODO: replace variables

        return script.toString();
    }

    private void clearScript() {
        script = new StringJoiner(System.lineSeparator());
    }

    private void addSequentialImport() {
        script.add("from keras.models import Sequential");
    }

    private void addFunctionalImport() {
        script.add("from keras.models import Input, Model");
    }

    private void addLayersImport() {
        script.add(KerasScriptUtil.makeLayersImportScript(modelFlowData.getLayerSet())).add(StringUtils.EMPTY);
    }

    private void addSequentialModel() {
        script.add(KerasScriptUtil.makeSequentialModelScript(modelFlowData)).add(StringUtils.EMPTY);
    }

    private void addFunctionalModel() throws Exception {
        script.add(KerasScriptUtil.makeFunctionalModelScript(modelFlowData)).add(StringUtils.EMPTY);
    }

    protected boolean useFitGenerator() {
        List<KerasFlowOutputNode> outputNodes = modelFlowData.getOutputNodes();
        for (KerasFlowOutputNode output : outputNodes) {
            KerasFlowDataNode trainDataNode = output.getTrainDataNode();

            if (trainDataNode instanceof KerasFlowDataIDGNode) return true;
        }
        return false;
    }

    protected abstract void addDataLoad() throws Exception;
    protected abstract void addGenerationModeSpecificScript() throws Exception;
}
