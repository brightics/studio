package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.StringJoiner;

public class DLPythonScriptBuilder {

    private static final String SCRIPT_DELIM = "\n";

    static String getActionType(JsonObject param) {
        if (!param.has("action_type")) {
            return "trainingJob";
        } else {
            return param.get("action_type").getAsJsonPrimitive().getAsString();
        }
    }

    public static String script(TaskMessageWrapper message) {
        StringJoiner script = new StringJoiner(SCRIPT_DELIM);
        String actionType = getActionType(message.params.internalData);
        if (EnumUtils.isValidEnum(DLScriptFactory.class, StringUtils.upperCase(actionType))) {
            return EnumUtils.getEnum(DLScriptFactory.class, StringUtils.upperCase(actionType)).getScript(script, message);
        } else {
            throw new BrighticsCoreException("3008", actionType);
        }
    }

    //TODO move this class to common library for sharing with brightics-DL server.
    enum DLScriptFactory {
        JOB_EXECUTE_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", getContent(message)));
                script.add(String.format("execution_type = '%s'", getExecutionType(message)));
                script.add(String.format("JobRunner().run(json_str, execution_type)"));
                return script.toString();
            }
        },
        JOB_EXECUTE_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", getContent(message)));
                script.add(String.format("execution_type = '%s'", getExecutionType(message)));
                script.add(String.format("JobRunner().inference_job_run(json_str,  execution_type)"));
                return script.toString();
            }
        },
        JOB_STATUS_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_job_status('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_STATUS_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_inference_job_status('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_TEXT_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_job_text('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_TEXT_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_inference_job_text('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_LOG_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format(("JobRunner().get_job_log('%s','%s')"), getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_LOG_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format(("JobRunner().get_job_inference_log('%s','%s')"), getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_HTML_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_job_html('%s')", getHtmlPath(message)));
                return script.toString();
            }
        },
        JOB_TENSORBOARD_URL {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().get_tensorboard_url('%s')", getOutputPath(message)));
                return script.toString();
            }
        },
        JOB_METRICS_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("EventParser('%s').get_all()", getJobId(message)));
                return script.toString();
            }
        },
        JOB_STOP_TRAINING {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().stop_job('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        JOB_STOP_INFERENCE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("JobRunner().inference_stop_job('%s', '%s')", getJobId(message), getExecutionType(message)));
                return script.toString();
            }
        },
        PREVIEW_CREATE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", getContent(message)));
                script.add(String.format("PreviewerManager.create_previewer(json_str, '%s')", getJobId(message)));
                return script.toString();
            }
        },
        PREVIEW_NEXT {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", getContent(message)));
                script.add(String.format("PreviewerManager.get_next('%s', json_str)", getJobId(message)));
                return script.toString();
            }
        },
        PREVIEW_DELETE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("PreviewerManager.delete_previewer('%s')", getJobId(message)));
                return script.toString();
            }
        },
        SCRIPT_RUNNER_CREATE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add("json_str = " + String.format("r\"\"\"%s\"\"\"", getContent(message)));
                script.add(String.format("script_runner.create_script('%s', json_str)", getJobId(message)));
                return script.toString();
            }
        },
        SCRIPT_RUNNER_RESULT {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("script_runner.get_result('%s')", getJobId(message)));
                return script.toString();
            }
        },
        SCRIPT_RUNNER_DELETE {
            @Override
            public String getSource(StringJoiner script, TaskMessageWrapper message) {
                script.add(String.format("script_runner.delete_script('%s')", getJobId(message)));
                return script.toString();
            }
        };

        public String getScript(StringJoiner script, TaskMessageWrapper message) {
            // import base package.
            script.add("from brightics.deeplearning.runner.job_runner_class import JobRunner");
            script.add("from brightics.deeplearning.input_function.previewer import PreviewerManager");
            script.add("from brightics.deeplearning.event import EventParser");
            script.add("from brightics.deeplearning.runner import script_runner");
            //get script by action type
            return getSource(script, message);
        }

        public abstract String getSource(StringJoiner script, TaskMessageWrapper message);

        String getContent(TaskMessageWrapper message) {
            return getJsonEmFromParams(message, "content");
        }

        String getJobId(TaskMessageWrapper message) {
            return getJsonEmFromParams(message, "jobId");
        }

        String getHtmlPath(TaskMessageWrapper message) {
            return getJsonEmFromParams(message, "htmlPath");
        }

        String getOutputPath(TaskMessageWrapper message) {
            return getJsonEmFromParams(message, "outputPath");
        }

        String getExecutionType(TaskMessageWrapper message) {
            if (!message.params.internalData.has("execution_type")) {
                return "default";
            } else {
                JsonElement scriptEm = message.params.internalData.get("execution_type");
                return scriptEm.getAsJsonPrimitive().getAsString();
            }
        }

        private String getJsonEmFromParams(TaskMessageWrapper message, String key) {
            if (!message.params.internalData.has(key)) {
                throw new BrighticsCoreException("3109", "'deep learning " + key + "'");
            }
            JsonElement jsonElement = message.params.internalData.get(key);
            if (jsonElement.isJsonPrimitive()) {
                return jsonElement.getAsJsonPrimitive().getAsString();
            } else {
                return jsonElement.getAsJsonObject().toString();
            }
        }


    }

}