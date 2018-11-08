package com.samsung.sds.brightics.server.common.util.keras.flow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.StringJoiner;

import com.samsung.sds.brightics.server.common.util.keras.PythonScriptUtil;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameterConstant;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameters;
import com.samsung.sds.brightics.server.common.util.keras.model.PythonTypes;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public class KerasFlowDataIDGNode extends KerasFlowDataNode {

    private static final List<KerasParameters> PARAMETERS = Arrays.asList(
            new KerasParameters("featurewise_center", PythonTypes.BOOL),
            new KerasParameters("featurewise_std_normalization", PythonTypes.BOOL),
            new KerasParameters("zca_whitening", PythonTypes.BOOL),
            new KerasParameters("rotation_range", PythonTypes.NUMBER),
            new KerasParameters("width_shift_range", PythonTypes.NUMBER),
            new KerasParameters("height_shift_range", PythonTypes.NUMBER),
            new KerasParameters("horizontal_flip", PythonTypes.BOOL),
            new KerasParameters("vertical_flip", PythonTypes.BOOL),
            new KerasParameters("rescale", PythonTypes.FRACTION));

    public KerasFlowDataIDGNode(String fid, JsonObject function) {
        super(fid, function);
    }

    @Override
    public void validate() throws BrighticsCoreException {
        if (PythonScriptUtil.isJsonElementBlank(param.get("method"))) {
            throw new BrighticsCoreException("4411", "ImageDataGenerator activity", "Method");
        }

        if (PythonScriptUtil.isJsonElementBlank(param.get("input_shape"))) {
            throw new BrighticsCoreException("4411", "ImageDataGenerator activity", "Input Shape");
        }

        setInputShape();
    }

    @Override
    public String script(boolean useOnlyFileName) throws Exception {
        StringJoiner script = new StringJoiner(LINE_SEPARATOR);

        String arguments = PythonScriptUtil.makePythonArgumentsString(Collections.emptyList(), PARAMETERS, param);
        script.add(String.format("%s = ImageDataGenerator(%s)", getIDGVariableName(), arguments));

        List<String> methods = getMethods();

        for (String method : methods) {
            IDGMethod m = IDGMethod.get(method);
            if (m != null) {
                JsonObject args = param.get(method).getAsJsonObject();
                String argsString = PythonScriptUtil.makePythonArgumentsString(m.requiredParams, m.optionalParams, args);

                script.add(m.script(getDataVariableName(), getIDGVariableName(), argsString));
            }
        }

        return script.toString();
    }

    @Override
    public String importScript() {
        return "from keras.preprocessing.image import ImageDataGenerator";
    }

    private String getIDGVariableName() {
        return makeNameWithIndex("idg");
    }

    private List<String> getMethods() {
        List<String> methods = new ArrayList<>();

        JsonArray methodArray = param.get("method").getAsJsonArray();
        for (JsonElement method : methodArray) {
            if (method != null && method.isJsonPrimitive()) {
                methods.add(method.getAsString());
            }
        }

        return methods;
    }

    enum IDGMethod {
        FIT("fit"
                , Collections.singletonList(KerasParameterConstant.X)
                , Collections.singletonList(KerasParameterConstant.SEED)) {
            @Override
            String script(String dataVariable, String idgVariable, String args) {
                return String.format("%n%s.fit(%s)", idgVariable, args);
            }
        },
        FLOW("flow"
                , Arrays.asList(KerasParameterConstant.X, KerasParameterConstant.Y)
                , Collections.singletonList(KerasParameterConstant.SEED)) {
            @Override
            String script(String dataVariable, String idgVariable, String args) {
                return String.format("%n%s = %s.flow(%s)", dataVariable, idgVariable, args);
            }
        },
        FLOW_FROM_DIRECTORY("flow_from_directory"
                , Collections.singletonList(KerasParameterConstant.DIRECTORY)
                , Arrays.asList(KerasParameterConstant.TARGET_SIZE
                        , KerasParameterConstant.CLASS_MODE
                        , KerasParameterConstant.BATCH_SIZE
                        , KerasParameterConstant.SHUFFLE
                        , KerasParameterConstant.SEED)) {
            @Override
            String script(String dataVariable, String idgVariable, String args) {
                return String.format("%n%s = %s.flow_from_directory(%s)", dataVariable, idgVariable, args);
            }
        };

        String name;
        List<KerasParameters> requiredParams;
        List<KerasParameters> optionalParams;

        IDGMethod(String name, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
            this.name = name;
            this.requiredParams = requiredParams;
            this.optionalParams = optionalParams;
        }

        static IDGMethod get(String method) {
            if (StringUtils.equals(method, "fit")) return IDGMethod.FIT;
            if (StringUtils.equals(method, "flow")) return IDGMethod.FLOW;
            if (StringUtils.equals(method, "flow_from_directory")) return IDGMethod.FLOW_FROM_DIRECTORY;

            return null;
        }

        abstract String script(String dataVariable, String idgVariable, String args);
    }
}
