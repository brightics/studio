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
                    wrapScriptByFunc();
        }
    },
    UDF {
        @Override
        public String getSource(TaskMessageWrapper message) {
            return scriptBuilder(message).
                    addInputsUDFScript().
                    addParameters().
                    addScript().
                    addPutOutputsScript().
                    addWriteOutputsScript().
                    wrapScriptByFunc();
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
            return DLPythonScriptBuilder.script(message);
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

