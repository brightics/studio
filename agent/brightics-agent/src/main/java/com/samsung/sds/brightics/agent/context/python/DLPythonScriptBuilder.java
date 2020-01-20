package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

import java.util.StringJoiner;

public class DLPythonScriptBuilder {

    private static final String SCRIPT_DELIM = "\n";

    static String getExecutionType(JsonObject param) {
        if (!param.has("execution_type")) {
            return "default";
        } else {
            JsonElement scriptEm = param.get("execution_type");
            return scriptEm.getAsJsonPrimitive().getAsString();
        }
    }

    static String getActionType(JsonObject param) {
        if (!param.has("action_type")) {
            return "trainingJob";
        } else {
            JsonElement scriptEm = param.get("action_type");
            return scriptEm.getAsJsonPrimitive().getAsString();
        }
    }

    static JsonObject getContent(JsonObject param) {
        if (!param.has("content")) {
            throw new BrighticsCoreException("3109", "'deep learning content'");
        }
        JsonElement scriptEm = param.get("content");
        return scriptEm.getAsJsonObject();
    }

    static String getStringValueFromParams(TaskMessageWrapper message, String key) {
        if (!message.params.internalData.has(key)) {
            throw new BrighticsCoreException("3109", "'deep learning " + key + "'");
        }
        JsonElement scriptEm = message.params.internalData.get(key);
        return scriptEm.getAsJsonPrimitive().getAsString();
    }

    static String getJobId(TaskMessageWrapper message){
        return getStringValueFromParams(message,"jobId");
    }

    static String getHtmlPath(TaskMessageWrapper message) { return getStringValueFromParams(message,"htmlPath"); }

    static String getOutputPath(TaskMessageWrapper message) { return getStringValueFromParams(message,"outputPath"); }

    static StringJoiner getStringJoiner(){
        return new StringJoiner(SCRIPT_DELIM);
    }

    public static String script(TaskMessageWrapper message){
        String executionType = getExecutionType(message.params.internalData);
        String actionType = getActionType(message.params.internalData);
        return ScriptBuilder.script(message, actionType, executionType);
    }

    static class ScriptBuilder{
        public static String script(TaskMessageWrapper message, String actionType, String executionType) {
            StringJoiner script = getStringJoiner();
            // import every time
            initImports(script);
            if (actionType.startsWith("job_execute")) {
                JobExecuteScript(script, actionType, message, executionType);
            } else if (actionType.startsWith("job_status")) {
                getJobStatusScript(script, actionType, getJobId(message), executionType);
            } else if (actionType.startsWith("job_text")) {
                getJobTextScript(script, actionType, getJobId(message), executionType);
            } else if (actionType.startsWith("job_log")){
                getJobLogScript(script, actionType, getJobId(message), executionType);
            } else if (actionType.startsWith("job_html")) {
                getJobHtmlScript(script, actionType,getHtmlPath(message));
            } else if (actionType.startsWith("job_tensorboard")) {
                getTensorboardUrl(script, actionType,getOutputPath(message));
            } else if (actionType.startsWith("job_metrics")) {
                getJobMetricsScript(script, actionType,getJobId(message));
            } else if (actionType.startsWith("job_stop")) {
                stopJobScript(script, actionType,getJobId(message), executionType);
            } else if (actionType.startsWith("preview")) {
                previewScript(script, actionType, getJobId(message), message);
            } else if (actionType.startsWith("simulation")) {
                simulationScript(script, actionType,getJobId(message), message);
            } else if (actionType.startsWith("endpoint")){
                endpointScript(script, actionType, message);
            } else if (actionType.startsWith("script_runner")){
                scriptRunnerScript(script, actionType, getJobId(message), message);
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
            return script.toString();
        }

        private static void initImports(StringJoiner script) {
            script.add("from brightics.deeplearning.runner.job_runner_class import JobRunner");
            script.add("from brightics.deeplearning.runner import bmp_job_runner");
        }

        private static void JobExecuteScript(StringJoiner script, String actionType, TaskMessageWrapper message, String executionType) {

            if (actionType.equals("job_execute_training")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("execution_type = '%s'", executionType));
                script.add(String.format("JobRunner().run(json_str, execution_type)"));
            } else if (actionType.equals("job_execute_bmp")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add("bmp_job_runner.run(json_str)");
            } else if (actionType. equals("job_execute_inference")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("execution_type = '%s'", executionType));
                script.add(String.format("JobRunner().inference_job_run(json_str, execution_type)"));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void getJobStatusScript(StringJoiner script, String actionType, String jobId, String executionType) {
            if (actionType.equals("job_status_training")) {
                script.add(String.format("JobRunner().get_job_status('%s', '%s')", jobId, executionType));
            } else if (actionType.equals("job_status_bmp")) {
                script.add(String.format("bmp_job_runner.get_job_status('%s')", jobId));
            } else if (actionType.equals("job_status_inference")) {
                script.add(String.format("JobRunner().get_inference_job_status('%s', '%s')", jobId, executionType));
            } else if (actionType.equals("job_status_endpoint")){
                script.add(String.format("sbrain_endpoint.get_job_status('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void getJobTextScript(StringJoiner script, String actionType, String jobId, String executionType) {
            if (actionType.equals("job_text_training")) {
                script.add(String.format("JobRunner().get_job_text('%s', '%s')", jobId, executionType));
            } else if (actionType.equals("job_text_bmp")) {
                script.add(String.format("bmp_job_runner.get_job_text('%s')", jobId));
            } else if (actionType.equals("job_text_inference")) {
                script.add(String.format("JobRunner().get_inference_job_text('%s', '%s')", jobId, executionType));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void getJobLogScript(StringJoiner script, String actionType, String jobId, String executionType){
            if(actionType.equals("job_log_training")){
                script.add(String.format(("JobRunner().get_job_log('%s','%s')"), jobId, executionType));
            } else if (actionType.equals("job_log_bmp")) {
                script.add(String.format("bmp_job_runner.get_job_log('%s')", jobId));
            } else if(actionType.equals("job_log_inference")){
                script.add(String.format(("JobRunner().get_job_inference_log('%s','%s')"), jobId, executionType));
            }
        }

        private static void getJobHtmlScript(StringJoiner script, String actionType, String htmlPath) {
            if (actionType.equals("job_html_inference")) {
                script.add(String.format("JobRunner().get_job_html('%s')", htmlPath));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void getTensorboardUrl(StringJoiner script, String actionType, String outputPath) {
            if (actionType.equals("job_tensorboard_url")) {
                script.add(String.format("JobRunner().get_tensorboard_url('%s')", outputPath));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void getJobMetricsScript(StringJoiner script, String actionType, String jobId) {
            script.add("from brightics.deeplearning.event import EventParser");
            if (actionType.equals("job_metrics_training")) {
                script.add(String.format("EventParser('%s').get_all()", jobId));
            } else if (actionType.equals("job_metrics_bmp")) {
                script.add(String.format("bmp_job_runner.get_job_metrics('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void stopJobScript(StringJoiner script, String actionType, String jobId, String executionType) {
            if (actionType.equals("job_stop_training")) {
                script.add(String.format("JobRunner().stop_job('%s', '%s')", jobId, executionType));
            } else if (actionType.equals("job_stop_bmp")) {
                script.add(String.format("bmp_job_runner.stop_job('%s')", jobId));
            } else if (actionType.equals("job_stop_inference")) {
                script.add(String.format("JobRunner().inference_stop_job('%s', '%s')", jobId, executionType));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }

        }

        private static void previewScript(StringJoiner script, String actionType, String jobId, TaskMessageWrapper message) {
            script.add("from brightics.deeplearning.input_function.previewer import PreviewerManager");
            if (actionType.equals("preview_create")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("PreviewerManager.create_previewer(json_str, '%s')", jobId));
            } else if (actionType.equals("preview_next")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("PreviewerManager.get_next('%s', json_str)", jobId));
            } else if (actionType.equals("preview_delete")) {
                script.add(String.format("PreviewerManager.delete_previewer('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void simulationScript(StringJoiner script, String actionType, String jobId, TaskMessageWrapper message) {
            script.add("from brightics.deeplearning.runner.sbrain_image_classification_simulator import SimulatorManager");
            if (actionType.equals("simulation_create")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("SimulatorManager.create_simulator(json_str, '%s')", jobId));
            } else if (actionType.equals("simulation_next")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("SimulatorManager.get_next('%s', json_str)", jobId));
            } else if (actionType.equals("simulation_summary")) {
                script.add(String.format("SimulatorManager.get_summary('%s')", jobId));
            } else if (actionType.equals("simulation_delete")) {
                script.add(String.format("SimulatorManager.delete_simulator('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void endpointScript(StringJoiner script, String actionType, TaskMessageWrapper message) {
            script.add("from brightics.deeplearning.inference import sbrain_endpoint");
            if (actionType.equals("endpoint_create")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add("sbrain_endpoint.create(json_str)");
            } else if (actionType.equals("endpoint_delete")) {
                String jobId = getJobId(message);
                script.add(String.format("sbrain_endpoint.delete('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }

        private static void scriptRunnerScript(StringJoiner script, String actionType, String jobId, TaskMessageWrapper message) {
            script.add("from brightics.deeplearning.runner import script_runner");
            if (actionType.equals("script_runner_create")) {
                JsonObject content = getContent(message.params.internalData);
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", content.toString()));
                script.add(String.format("script_runner.create_script('%s', json_str)", jobId));
            } else if (actionType.equals("script_runner_result")) {
                script.add(String.format("script_runner.get_result('%s')", jobId));
            } else if (actionType.equals("script_runner_delete")) {
                script.add(String.format("script_runner.delete_script('%s')", jobId));
            } else {
                throw new BrighticsCoreException("3008", actionType);
            }
        }
    }
}