package com.samsung.sds.brightics.agent.context.python;

import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import org.apache.commons.lang3.EnumUtils;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@SuppressWarnings("unused")
public enum PythonScriptType {
    Python {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).addScript().script();
        }
    },
    LegacyPythonScript {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addInDataScript().
                    addInputVariablesScript().
                    addScript().
                    addPutOutTableAliasDataScript().
                    addWriteOutDataScript().
                    script();
        }
    },
    PythonScript {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addInputsScript().
                    addInputVariablesScript().
                    addScript().
                    addPutScriptResultScript().
                    addWriteOutputsScript().
                    script();
        }
    },
    UDF {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addInputsScript().
                    addParameters().
                    addScript().
                    addPutOutputsScript().
                    addWriteOutputsScript().
                    script();
        }
    },
    Function {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addFunctionParamsScript().
                    addFunctionScript(message.taskMessage.getName(), "func_result").
                    addPutFunctionResultScript("func_result").
                    addWriteOutputsScript().
                    script();
        }
    },
    PyFunction {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addInDataScript().
                    addOutDataScript().
                    addScript().
                    addWriteOutDataScript().
                    script();
        }
    },
    DLPythonScript {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addScript().
                    script();
        }
    },
    DLPredict {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addScript().
                    addPutOutTableAliasDataScript().
                    addWriteOutDataScript().
                    script();
        }
    };

    private static final Set<String> TYPES_HAS_LEGACY = Stream.of("PythonScript").collect(Collectors.toSet());

    public static PythonScriptType getType(TaskMessageWrapper message) {
        String name = message.taskMessage.getName();

        if (TYPES_HAS_LEGACY.contains(name) && message.version.isPreviousThan("3.6")) {
            return valueOf("Legacy" + name);
        } else if (EnumUtils.isValidEnum(PythonScriptType.class, name)) {
            return valueOf(name);
        } else {
            return PyFunction;
        }
    }

    public abstract String getSource(TaskMessageWrapper message);

    PythonScriptBuilder scriptBuilder(TaskMessageWrapper message) {
        return new PythonScriptBuilder(message);
    }
}

