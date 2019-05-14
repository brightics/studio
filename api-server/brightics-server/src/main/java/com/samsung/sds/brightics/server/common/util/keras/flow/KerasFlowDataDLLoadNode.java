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

import com.google.gson.JsonElement;
import com.samsung.sds.brightics.server.common.util.keras.KerasScriptUtil;
import com.samsung.sds.brightics.server.common.util.keras.PythonScriptUtil;
import com.samsung.sds.brightics.server.common.util.keras.model.PythonTypes;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import scala.annotation.meta.param;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class KerasFlowDataDLLoadNode extends KerasFlowDataNode {

    private LoadType loadType;

    public KerasFlowDataDLLoadNode(String fid, JsonObject function) {
        super(fid, function);

        this.loadType = getLoadType();
    }

    @Override
    public void validate() throws BrighticsCoreException {
        this.loadType.validate(param);

        setInputShape();
    }

    @Override
    public String script(boolean useOnlyFileName) {
        return this.loadType.script(this, useOnlyFileName);
    }

    @Override
    public String importScript() {
        return this.loadType.importScript();
    }

    public LoadType getLoadType() {
        JsonElement loadTypeElem = param.get("loadType");
        String loadType = "HDFS";

        if (loadTypeElem != null) {
            loadType = loadTypeElem.getAsString().toUpperCase();
        }

        if (EnumUtils.isValidEnum(LoadType.class, loadType)) {
            return EnumUtils.getEnum(LoadType.class, loadType);
        }

        return LoadType.HDFS;
    }

    public String getInputPath() {
        if (PythonScriptUtil.isJsonElementBlank(param.get("input_path"))) {
            throw new BrighticsCoreException("4411", "DL Load activity", "Input Path");
        }

        return param.get("input_path").getAsString();
    }

    public String getTrainData() {
        try {
            return this.loadType.getTrainData(param);
        } catch (Exception e) {
            throw new BrighticsCoreException("4001", "Train data", "String");
        }
    }

    public String getTrainLabel() {
        try {
            return this.loadType.getTrainLabel(param);
        } catch (Exception e) {
            throw new BrighticsCoreException("4001", "Train label", "String");
        }
    }

    public String getInputDataVariableName() {
        return makeNameWithIndex("input_df");
    }

    public String getLabelVariableName() {
        return makeNameWithIndex("Y_train");
    }
}

enum LoadType {
    NPY {
        @Override
        void validate(JsonObject param) throws BrighticsCoreException {
            if (PythonScriptUtil.isJsonElementBlank(param.get("train_data_path"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Train Data");
            }

            if (PythonScriptUtil.isJsonElementBlank(param.get("train_label_path"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Train Label");
            }

            if (PythonScriptUtil.isJsonElementBlank(param.get("input_shape"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Input Shape");
            }
        }

        @Override
        String importScript() {
            return "import numpy as np";
        }

        @Override
        String script(KerasFlowDataDLLoadNode node, boolean useOnlyFileName) {
            String trainData = node.getTrainData();
            String trainLabel = node.getTrainLabel();

            if (!useOnlyFileName) {
                String dlHomePath = KerasScriptUtil.getDLHomePath();
                trainData = Paths.get(dlHomePath, trainData).toString();
                trainLabel = Paths.get(dlHomePath, trainLabel).toString();
            }

            String data = String.format("%s = np.load(\"\"\"%s\"\"\")", node.getDataVariableName(), trainData);
            String label = String.format("%s = np.load(\"\"\"%s\"\"\")", node.getLabelVariableName(), trainLabel);
            return data + LINE_SEPARATOR + label;
        }

        @Override
        String getTrainData(JsonObject param) throws Exception {
            return param.get("train_data_path").getAsString();
        }

        @Override
        String getTrainLabel(JsonObject param) throws Exception {
            return param.get("train_label_path").getAsString();
        }
    }, HDFS {
        @Override
        void validate(JsonObject param) throws BrighticsCoreException {
            if (PythonScriptUtil.isJsonElementBlank(param.get("input_path"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Input Path");
            }

            if (PythonScriptUtil.isJsonElementBlank(param.get("train_data_column"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Train Data");
            }

            if (PythonScriptUtil.isJsonElementBlank(param.get("train_label_column"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Train Label");
            }

            if (PythonScriptUtil.isJsonElementBlank(param.get("input_shape"))) {
                throw new BrighticsCoreException("4411", "DL Load activity", "Input Shape");
            }
        }

        @Override
        String importScript() {
            return StringUtils.EMPTY;
        }

        @Override
        String script(KerasFlowDataDLLoadNode node, boolean useOnlyFileName) {
            String inputVariableName = node.getInputDataVariableName();

            String inputDf = inputVariableName + " = read_parquet(\"\"\"" + node.getInputPath() + "\"\"\")";
            String data = String.format("%s = %s[%s].values", node.getDataVariableName(), inputVariableName, node.getTrainData());
            String label = String.format("%s = %s[%s].values", node.getLabelVariableName(), inputVariableName, node.getTrainLabel());

            return inputDf + LINE_SEPARATOR + data + LINE_SEPARATOR + label;
        }

        @Override
        String getTrainData(JsonObject param) throws Exception {
            return PythonTypes.LIST.script(param.get("train_data_column"));
        }

        @Override
        String getTrainLabel(JsonObject param) throws Exception {
            return PythonTypes.LIST.script(param.get("train_label_column"));
        }
    };

    private static final String LINE_SEPARATOR = System.lineSeparator();


    abstract void validate(JsonObject param) throws BrighticsCoreException;

    abstract String importScript();
    abstract String script(KerasFlowDataDLLoadNode node, boolean useOnlyFileName);

    abstract String getTrainData(JsonObject param) throws Exception;
    abstract String getTrainLabel(JsonObject param) throws Exception;
}