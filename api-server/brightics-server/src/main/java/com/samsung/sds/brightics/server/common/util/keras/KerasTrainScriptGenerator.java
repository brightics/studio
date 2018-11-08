package com.samsung.sds.brightics.server.common.util.keras;

import java.util.Arrays;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonObject;

public class KerasTrainScriptGenerator extends KerasModelScriptGenerator {

    String metrics;
    String user;
    String checkpoint = "checkpoint";

    public KerasTrainScriptGenerator(JsonObject model, String jid) throws Exception {
        super(model, jid);

        this.metrics = this.param.get("metrics").getAsString();
        this.user = model.get("user").getAsString();

        if (!PythonScriptUtil.isJsonElementBlank(this.param.get("checkPointGroupName"))) {
            this.checkpoint = this.param.get("checkPointGroupName").getAsString();
        }
    }

    @Override
    protected void addDataLoad() throws Exception {
        script.add(KerasScriptUtil.makeTrainDataLoadScript(modelFlowData.getDataNodes(), false));
    }

    @Override
    protected void addGenerationModeSpecificScript() throws Exception {
        String loggerCallback = "brightics_logger";
        String checkpointCallback = "checkpoint";

        script.add(KerasScriptUtil.makeModelCompileScript(param));
        script.add(StringUtils.EMPTY);

        script.add(KerasScriptUtil.makeAddSystemPathBrighticsModulesDir());

        script.add(KerasScriptUtil.makeBrighticsLoggerCallbackScript(loggerCallback, jid));
        script.add(KerasScriptUtil.makeCheckpointLoggerCallbackScript(checkpointCallback, user, checkpoint, metrics));

        if (useFitGenerator()) {
            script.add(KerasScriptUtil.makeModelFitGeneratorScriptWithCallbacks(param, modelFlowData.getOutputNodes(), Arrays.asList(loggerCallback, checkpointCallback)));
        } else {
            script.add(KerasScriptUtil.makeModelFitScriptWithCallbacks(param, modelFlowData.getOutputNodes(), Arrays.asList(loggerCallback, checkpointCallback)));
        }
    }
}