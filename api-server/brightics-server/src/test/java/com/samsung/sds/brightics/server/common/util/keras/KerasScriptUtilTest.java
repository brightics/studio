package com.samsung.sds.brightics.server.common.util.keras;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataDLLoadNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataIDGNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowOutputNode;

public class KerasScriptUtilTest {

    private static final String INPUT_PATH = "data.parquet";
    private static final String X_TRAIN = "x_train";
    private static final String Y_TRAIN = "y_label";

    private JsonObject param;
    private Map<String, JsonObject> functions;
    private JsonArray links;

    private KerasModelFlow modelData;

    private JsonObject load;
    private JsonObject output;

    private static final String CUSTOM_PYTHON_SCRIPT =
        "import numpy as np\n"
        + "np.random.seed(123)  # for reproducibility\n"
        + "from keras.utils import np_utils\n"
        + "from keras.datasets import mnist\n"
        + "(X_train, Y_train), (X_test, Y_test) = mnist.load_data()\n"
        + "X_train = X_train.reshape(X_train.shape[0], 28, 28, 1)\n"
        + "X_test = X_test.reshape(X_test.shape[0], 28, 28, 1)\n"
        + "X_train = X_train.astype('float32')\n"
        + "X_test = X_test.astype('float32')\n"
        + "X_train /= 255\n"
        + "X_test /= 255\n"
        + "# 6. Preprocess class labels\n"
        + "Y_train = np_utils.to_categorical(Y_train, 10)\n"
        + "Y_test = np_utils.to_categorical(Y_test, 10)";

    private static final String LINE_SEPARATOR = System.getProperty("line.separator");

    @Before
    public void setUp() throws Exception {
        param = new JsonObject();
        param.addProperty("optimizer", "adam");
        param.addProperty("loss", "categorical_crossentropy");
        param.addProperty("metrics", "accuracy");
        param.addProperty("epochs", "10");
        param.addProperty("steps_per_epoch", "10");
        param.addProperty("batch_size", "32");
        param.addProperty("validation_steps", "10");
        param.addProperty("execution", "run");
        param.addProperty("checkPointGroupName", "test");

        /* functions */
        functions = new HashMap<>();

        // load
        JsonObject loadParam = new JsonObject();
        loadParam.addProperty("input_path", INPUT_PATH);
        loadParam.addProperty("train_data_column", X_TRAIN);
        loadParam.addProperty("train_label_column", Y_TRAIN);

        JsonArray loadParamInputShape = new JsonArray();
        loadParamInputShape.add("28");
        loadParamInputShape.add("28");
        loadParamInputShape.add("1");
        loadParam.add("input_shape", loadParamInputShape);

        load = new JsonObject();
        load.addProperty("name", "DlLoad");
        load.addProperty("fid", "load");
        load.add("param", loadParam);

        functions.put("load", load);

        // python script
        JsonObject pythonScriptParam = new JsonObject();
        pythonScriptParam.addProperty("script", CUSTOM_PYTHON_SCRIPT);

        JsonObject pythonScript = new JsonObject();
        pythonScript.addProperty("name", "DLPythonScript");
        pythonScript.addProperty("fid", "python_script");
        pythonScript.add("param", pythonScriptParam);

        functions.put("python_script", pythonScript);

        // conv2d 1
        JsonObject conv2d1Param = new JsonObject();
        conv2d1Param.addProperty("filters", "32");
        conv2d1Param.addProperty("activation", "relu");
        conv2d1Param.addProperty("padding", "valid");
        conv2d1Param.addProperty("use_bias", "true");

        JsonArray conv2d1KernelSize = new JsonArray();
        conv2d1KernelSize.add("3");
        conv2d1KernelSize.add("3");
        conv2d1Param.add("kernel_size", conv2d1KernelSize);

        JsonArray conv2d1Strides = new JsonArray();
        conv2d1Strides.add("1");
        conv2d1Strides.add("1");
        conv2d1Param.add("strides", conv2d1Strides);

        JsonObject conv2d1 = new JsonObject();
        conv2d1.addProperty("name", "Conv2D");
        conv2d1.addProperty("fid", "conv2d1");
        conv2d1.add("param", conv2d1Param);

        functions.put("conv2d1", conv2d1);

        // conv2d 2
        JsonObject conv2d2Param = new JsonObject();
        conv2d2Param.addProperty("filters", "32");
        conv2d2Param.addProperty("activation", "relu");
        conv2d2Param.addProperty("padding", "valid");
        conv2d2Param.addProperty("use_bias", "true");

        JsonArray conv2d2KernelSize = new JsonArray();
        conv2d2KernelSize.add("3");
        conv2d2KernelSize.add("3");
        conv2d2Param.add("kernel_size", conv2d2KernelSize);
        conv2d2Param.add("strides", conv2d1Strides);

        JsonObject conv2d2 = new JsonObject();
        conv2d2.addProperty("name", "Conv2D");
        conv2d2.addProperty("fid", "conv2d2");
        conv2d2.add("param", conv2d2Param);

        functions.put("conv2d2", conv2d2);

        // MaxPooling2D
        JsonObject maxPooling2dParam = new JsonObject();
        maxPooling2dParam.addProperty("padding", "valid");

        JsonArray maxPooling2dPoolSize = new JsonArray();
        maxPooling2dPoolSize.add("2");
        maxPooling2dPoolSize.add("2");
        maxPooling2dParam.add("pool_size", maxPooling2dPoolSize);
        maxPooling2dParam.add("strides", maxPooling2dPoolSize);

        JsonObject maxPooling2d = new JsonObject();
        maxPooling2d.addProperty("name", "MaxPooling2D");
        maxPooling2d.addProperty("fid", "maxpooling2d");
        maxPooling2d.add("param", maxPooling2dParam);

        functions.put("maxpooling2d", maxPooling2d);

        // Dropout
        JsonObject dropout1Param = new JsonObject();
        dropout1Param.addProperty("rate", "0.5");

        JsonObject dropout1 = new JsonObject();
        dropout1.addProperty("name", "Dropout");
        dropout1.addProperty("fid", "dropout");
        dropout1.add("param", dropout1Param);

        functions.put("dropout", dropout1);

        // Flatten
        JsonObject flattenParam = new JsonObject();

        JsonObject flatten = new JsonObject();
        flatten.addProperty("name", "Flatten");
        flatten.addProperty("fid", "flatten");
        flatten.add("param", flattenParam);

        functions.put("flatten", flatten);

        // Dense
        JsonObject dense1Param = new JsonObject();
        dense1Param.addProperty("units", "128");
        dense1Param.addProperty("activation", "relu");

        JsonObject dense1 = new JsonObject();
        dense1.addProperty("name", "Dense");
        dense1.addProperty("fid", "dense");
        dense1.add("param", dense1Param);

        functions.put("dense", dense1);

        // Dropout
        JsonObject dropout2Param = new JsonObject();
        dropout2Param.addProperty("rate", "0.5");

        JsonObject dropout2 = new JsonObject();
        dropout2.addProperty("name", "Dropout");
        dropout2.addProperty("fid", "dropout2");
        dropout2.add("param", dropout2Param);

        functions.put("dropout2", dropout2);

        // Dense
        JsonObject dense2Param = new JsonObject();
        dense2Param.addProperty("units", "10");
        dense2Param.addProperty("activation", "softmax");

        JsonObject dense2 = new JsonObject();
        dense2.addProperty("name", "Dense");
        dense2.addProperty("fid", "dense2");
        dense2.add("param", dense2Param);

        functions.put("dense2", dense2);

        // Activation
        JsonObject activationParam = new JsonObject();
        activationParam.addProperty("activation", "softmax");

        JsonObject activation = new JsonObject();
        activation.addProperty("name", "Activation");
        activation.addProperty("fid", "activation");
        activation.add("param", activationParam);

        functions.put("activation", activation);

        // Output
        JsonObject outputParam = new JsonObject();
        outputParam.addProperty("train_data", "load");

        output = new JsonObject();
        output.addProperty("name", "Output");
        output.addProperty("fid", "output");
        output.add("param", outputParam);

        functions.put("output", output);

        /* links */
        links = new JsonArray();

        JsonObject link1 = makeLinkJsonObject("load", "python_script");
        JsonObject link2 = makeLinkJsonObject("python_script", "conv2d1");
        JsonObject link3 = makeLinkJsonObject("conv2d1", "conv2d2");
        JsonObject link4 = makeLinkJsonObject("conv2d2", "maxpooling2d");
        JsonObject link5 = makeLinkJsonObject("maxpooling2d", "dropout");
        JsonObject link6 = makeLinkJsonObject("dropout", "flatten");
        JsonObject link7 = makeLinkJsonObject("flatten", "dense");
        JsonObject link8 = makeLinkJsonObject("dense", "dropout2");
        JsonObject link9 = makeLinkJsonObject("dropout2", "dense2");
        JsonObject link10 = makeLinkJsonObject("dense2", "activation");
        JsonObject link11 = makeLinkJsonObject("activation", "output");

        links.add(link1);
        links.add(link2);
        links.add(link3);
        links.add(link4);
        links.add(link5);
        links.add(link6);
        links.add(link7);
        links.add(link8);
        links.add(link9);
        links.add(link10);
        links.add(link11);

        modelData = new KerasModelFlow(links, functions);
    }

    private JsonObject makeLinkJsonObject(String sourceFid, String targetFid) {
        JsonObject link = new JsonObject();
        link.addProperty("sourceFid", sourceFid);
        link.addProperty("targetFid", targetFid);
        return link;
    }

    @Test
    public void returnEmptyStringWhenLayersAreNotGiven() {
        String importScript = KerasScriptUtil.makeLayersImportScript(Collections.EMPTY_SET);

        assertThat(importScript).isEqualTo(StringUtils.EMPTY);
    }

    @Test
    public void testMakeFunctionalModelScript() throws Exception {
        String functionalModelScript = KerasScriptUtil.makeFunctionalModelScript(modelData);

        String[] funcModelLines = functionalModelScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "",
            CUSTOM_PYTHON_SCRIPT,
            "",
            "",
            "input_layer = Input(shape=(28,28,1), name=\"\"\"input_layer\"\"\")",
            "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)(input_layer)",
            "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)(x)",
            "x = MaxPooling2D(pool_size=(2,2), strides=(2,2), padding=\"\"\"valid\"\"\")(x)",
            "x = Dropout(rate=0.5)(x)",
            "x = Flatten()(x)",
            "x = Dense(units=128, activation=\"\"\"relu\"\"\")(x)",
            "x = Dropout(rate=0.5)(x)",
            "x = Dense(units=10, activation=\"\"\"softmax\"\"\")(x)",
            "output_layer = Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\")(x)",
            "",
            "model = Model(inputs=input_layer, outputs=output_layer)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testMakeSequentialModelScript() {
        String sequentialModelScript = KerasScriptUtil.makeSequentialModelScript(modelData);

        String[] seqModelLines = sequentialModelScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "",
            CUSTOM_PYTHON_SCRIPT,
            "",
            "model = Sequential()",
            "model.add(Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, input_shape=(28,28,1)))",
            "model.add(Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True))",
            "model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2), padding=\"\"\"valid\"\"\"))",
            "model.add(Dropout(rate=0.5))",
            "model.add(Flatten())",
            "model.add(Dense(units=128, activation=\"\"\"relu\"\"\"))",
            "model.add(Dropout(rate=0.5))",
            "model.add(Dense(units=10, activation=\"\"\"softmax\"\"\"))",
            "model.add(Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\"))"
        };

        assertThat(seqModelLines).containsExactly(expected);
    }

    @Test
    public void whenInputShapeIsNotArrayExceptionThrown() throws Exception {
        JsonArray invalidInputArray = new JsonArray();
        invalidInputArray.add("Hello?");

        functions.get("load").getAsJsonObject("param").add("input_shape", invalidInputArray);
        KerasModelFlow invalidInputShape = new KerasModelFlow(links, functions);

        assertThatThrownBy(() -> KerasScriptUtil.makeFunctionalModelScript(invalidInputShape))
                .hasMessage("'Input shape' is not of Array[Number] type. Entered value is '[\"Hello?\"]'");
    }

    @Test
    public void canMakeModelCompilationScriptWithParameters() throws Exception {
        assertThat(KerasScriptUtil.makeModelCompileScript(param))
                .isEqualTo("model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])");
    }

    @Test
    public void canMakeTrainDataLoadScript() throws Exception {
        String[] expected = new String[]{
                "input_df = read_parquet(\"\"\"" + INPUT_PATH + "\"\"\")",
                "X_train = input_df[[\"\"\"" + X_TRAIN + "\"\"\"]].values",
                "Y_train = input_df[[\"\"\"" + Y_TRAIN + "\"\"\"]].values"
        };

        JsonObject param = new JsonObject();
        param.addProperty("input_path", INPUT_PATH);
        param.addProperty("train_data_column", X_TRAIN);
        param.addProperty("train_label_column", Y_TRAIN);

        JsonObject dlLoad = new JsonObject();
        dlLoad.addProperty("name", "DLLoad");
        dlLoad.add("param", param);

        KerasFlowDataDLLoadNode dataNode = new KerasFlowDataDLLoadNode("fid", dlLoad);

        String dataLoadScript = KerasScriptUtil.makeTrainDataLoadScript(Collections.singletonList(dataNode), false);

        assertThat(dataLoadScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeTrainDataLoadScriptWhenLoadTypeNPY() throws Exception {
        String[] expected = new String[]{
                "import numpy as np",
                "",
                "X_train = np.load(\"\"\"\\home\\brightics\\brightics\\packages\\dl\\x_train\"\"\")",
                "Y_train = np.load(\"\"\"\\home\\brightics\\brightics\\packages\\dl\\y_label\"\"\")"
        };

        JsonObject param = new JsonObject();
        param.addProperty("loadType", "npy");
        param.addProperty("train_data_path", X_TRAIN);
        param.addProperty("train_label_path", Y_TRAIN);

        JsonObject dlLoad = new JsonObject();
        dlLoad.addProperty("name", "DLLoad");
        dlLoad.add("param", param);

        KerasFlowDataDLLoadNode dataNode = new KerasFlowDataDLLoadNode("fid", dlLoad);

        String dataLoadScript = KerasScriptUtil.makeTrainDataLoadScript(Collections.singletonList(dataNode), false);

        assertThat(dataLoadScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeTrainDataLoadScriptFromIDGWithFlowFromDirectoryMethodOnly() throws Exception {
        String[] expected = new String[] {
            "from keras.preprocessing.image import ImageDataGenerator",
            "",
            "idg = ImageDataGenerator(rescale=1./255)",
            "",
            "X_train = idg.flow_from_directory(directory=\"\"\"data_ori/train/\"\"\", target_size=(300,300), class_mode=\"\"\"categorical\"\"\", batch_size=10, shuffle=True)"
        };

        JsonObject param = new JsonObject();
        param.addProperty("rescale", "1./255");

        JsonArray method = new JsonArray();
        method.add(JsonNull.INSTANCE);
        method.add("flow_from_directory");

        param.add("method", method);

        JsonObject flowFromDirectory = new JsonObject();
        flowFromDirectory.addProperty("directory", "data_ori/train/");

        JsonArray targetSize = new JsonArray();
        targetSize.add("300");
        targetSize.add("300");

        flowFromDirectory.add("target_size", targetSize);

        flowFromDirectory.addProperty("batch_size", "10");
        flowFromDirectory.addProperty("shuffle", "True");
        flowFromDirectory.addProperty("class_mode", "categorical");

        param.add("flow_from_directory", flowFromDirectory);

        JsonObject idg = new JsonObject();
        idg.addProperty("name", "ImageDataGenerator");
        idg.add("param", param);

        KerasFlowDataIDGNode dataNode = new KerasFlowDataIDGNode("fid", idg);

        String dataLoadScript = KerasScriptUtil.makeTrainDataLoadScript(Collections.singletonList(dataNode), false);

        assertThat(dataLoadScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeTrainDataLoadScriptFromIDGWithFitAndFlowFromDirectoryMethod() throws Exception {
        String[] expected = new String[] {
            "from keras.preprocessing.image import ImageDataGenerator",
            "",
            "idg = ImageDataGenerator(rescale=1./255)",
            "",
            "idg.fit(x=\"\"\"data_ori/fit/\"\"\")",
            "",
            "X_train = idg.flow_from_directory(directory=\"\"\"data_ori/train/\"\"\", target_size=(300,300), class_mode=\"\"\"categorical\"\"\", batch_size=10, shuffle=True)"
        };

        JsonObject param = new JsonObject();
        param.addProperty("rescale", "1./255");

        JsonArray method = new JsonArray();
        method.add("fit");
        method.add("flow_from_directory");

        param.add("method", method);

        JsonObject fit = new JsonObject();
        fit.addProperty("x", "data_ori/fit/");

        param.add("fit", fit);

        JsonObject flowFromDirectory = new JsonObject();
        flowFromDirectory.addProperty("directory", "data_ori/train/");

        JsonArray targetSize = new JsonArray();
        targetSize.add("300");
        targetSize.add("300");

        flowFromDirectory.add("target_size", targetSize);

        flowFromDirectory.addProperty("batch_size", "10");
        flowFromDirectory.addProperty("shuffle", "True");
        flowFromDirectory.addProperty("class_mode", "categorical");

        param.add("flow_from_directory", flowFromDirectory);

        JsonObject idg = new JsonObject();
        idg.addProperty("name", "ImageDataGenerator");
        idg.add("param", param);

        KerasFlowDataIDGNode dataNode = new KerasFlowDataIDGNode("fid", idg);

        String dataLoadScript = KerasScriptUtil.makeTrainDataLoadScript(Collections.singletonList(dataNode), false);

        assertThat(dataLoadScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeTrainDataLoadScriptUsingOnlyFileName() throws Exception {
        String[] expected = new String[] {
                "input_df = read_parquet(\"\"\"" + INPUT_PATH + "\"\"\")",
                "X_train = input_df[[\"\"\"" + X_TRAIN + "\"\"\"]].values",
                "Y_train = input_df[[\"\"\"" + Y_TRAIN + "\"\"\"]].values"
        };

        JsonObject param = new JsonObject();
        param.addProperty("input_path", INPUT_PATH);
        param.addProperty("train_data_column", X_TRAIN);
        param.addProperty("train_label_column", Y_TRAIN);

        JsonObject dlLoad = new JsonObject();
        dlLoad.addProperty("name", "DLLoad");
        dlLoad.add("param", param);

        KerasFlowDataDLLoadNode dataNode = new KerasFlowDataDLLoadNode("fid", dlLoad);

        String dataLoadScript = KerasScriptUtil.makeTrainDataLoadScript(Collections.singletonList(dataNode), true);

        assertThat(dataLoadScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeModelFitScriptWithParameters() throws Exception {
        KerasFlowDataDLLoadNode inputDataNode = new KerasFlowDataDLLoadNode("inputFid", load);
        KerasFlowOutputNode outputNode = new KerasFlowOutputNode("outputFid", output);

        outputNode.setTrainData(inputDataNode);

        assertThat(KerasScriptUtil.makeModelFitScript(param, Collections.singletonList(outputNode)))
                .isEqualTo("model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10)");
    }

    @Test
    public void canMakeModelFitScriptWithDefaultBatchSizeDefaultEpochs() throws Exception {
        KerasFlowDataDLLoadNode inputDataNode = new KerasFlowDataDLLoadNode("inputFid", load);
        KerasFlowOutputNode outputNode = new KerasFlowOutputNode("outputFid", output);

        outputNode.setTrainData(inputDataNode);

        assertThat(KerasScriptUtil.makeModelFitScript(new JsonObject(), Collections.singletonList(outputNode)))
                .isEqualTo("model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train})");
    }

    @Test
    public void canMakeModelFitScriptWithCallbacks() throws Exception {
        KerasFlowDataDLLoadNode inputDataNode = new KerasFlowDataDLLoadNode("inputFid", load);
        KerasFlowOutputNode outputNode = new KerasFlowOutputNode("outputFid", output);

        outputNode.setTrainData(inputDataNode);

        assertThat(KerasScriptUtil.makeModelFitScriptWithCallbacks(
                        param, Collections.singletonList(outputNode), Arrays.asList("brightics_logger", "checkpoint")))
                .isEqualTo("model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10, callbacks=[brightics_logger, checkpoint], verbose=0)");
    }

    @Test
    public void canMakeModelFitScriptWithCallbacksAndDefaultBatchSizeDefaultEpochs() throws Exception {
        KerasFlowDataDLLoadNode inputDataNode = new KerasFlowDataDLLoadNode("inputFid", load);
        KerasFlowOutputNode outputNode = new KerasFlowOutputNode("outputFid", output);

        outputNode.setTrainData(inputDataNode);

        assertThat(
                KerasScriptUtil.makeModelFitScriptWithCallbacks(
                        new JsonObject(), Collections.singletonList(outputNode), Arrays.asList("brightics_logger", "checkpoint")))
                .isEqualTo("model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, callbacks=[brightics_logger, checkpoint], verbose=0)");
    }

    @Test
    public void canMakeBrighticsModuleDirAddToSystemPathScript() {
        String[] expected = new String[] {
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")"
        };

        String systemPath = KerasScriptUtil.makeAddSystemPathBrighticsModulesDir();

        assertThat(systemPath.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeBrighticsLoggerCallbackInitializeScript() {
        String[] expected = new String[] {
            "from brightics_keras_logger import BrighticsLogger",
            "brightics_logger = BrighticsLogger(\"\"\"/home/brightics/brightics/packages/dl/log/jid.log\"\"\")"
        };

        String brighticsLoggerCallback = KerasScriptUtil.makeBrighticsLoggerCallbackScript("brightics_logger", "jid");

        assertThat(brighticsLoggerCallback.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeModelCheckpointCallbackInitializeScriptWhenMetricsIsAccuracy() {
        String[] expected = new String[] {
            "from brightics_deeplearning_util import make_checkpoint_dir",
            "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics\"\"\", \"\"\"test\"\"\")",
            "",
            "from keras.callbacks import ModelCheckpoint",
            "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-accuracy_{acc:.2f}.hdf5\"\"\")"
        };

        String checkpointCallback = KerasScriptUtil.makeCheckpointLoggerCallbackScript("checkpoint", "brightics", "test", "accuracy");

        assertThat(checkpointCallback.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeModelCheckpointCallbackInitializeScriptWhenMetricsIsBinaryAccuracy() {
        String[] expected = new String[] {
            "from brightics_deeplearning_util import make_checkpoint_dir",
            "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics\"\"\", \"\"\"test\"\"\")",
            "",
            "from keras.callbacks import ModelCheckpoint",
            "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-binary_accuracy_{binary_accuracy:.2f}.hdf5\"\"\")"
        };

        String checkpointCallback = KerasScriptUtil.makeCheckpointLoggerCallbackScript("checkpoint", "brightics", "test", "binary_accuracy");

        assertThat(checkpointCallback.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeModelCheckpointCallbackInitializeScriptWhenMetricsIsCategoricalAccuracy() {
        String[] expected = new String[] {
            "from brightics_deeplearning_util import make_checkpoint_dir",
            "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics\"\"\", \"\"\"test\"\"\")",
            "",
            "from keras.callbacks import ModelCheckpoint",
            "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-categorical_accuracy_{categorical_accuracy:.2f}.hdf5\"\"\")"
        };

        String checkpointCallback = KerasScriptUtil.makeCheckpointLoggerCallbackScript("checkpoint", "brightics", "test", "categorical_accuracy");

        assertThat(checkpointCallback.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakeModelSummaryWriteToFileScript() {
        String[] expected = new String[] {
            "summary_log = []",
            "model.summary(line_length=200, print_fn=summary_log.append)",
            "",
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")",
            "",
            "from brightics_deeplearning_util import write_summary",
            "write_summary(\"\"\"/home/brightics/brightics/packages/dl/log/jid.summary\"\"\", summary_log)"
        };

        String makeModelFitScript = KerasScriptUtil.makeModelSummaryWriteScript("jid");

        assertThat(makeModelFitScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakePredictScript() {
        String outDFAlias = "result_df";
        String dlHome = Paths.get("/home/brightics/brightics/packages/dl").toString();

        String checkpointPath = Paths.get("/brightics@samsung.com/test/test-epoch_00-loss_1.58-accuracy_0.88.hdf5").toString();
        String dataPath = Paths.get("/data/preprocessed_x_test.npy").toString();

        JsonObject param = new JsonObject();
        param.addProperty("checkpointPath", checkpointPath);
        param.addProperty("inputDataPath", dataPath);
        param.addProperty("batch_size", "32");

        String[] expected = new String[] {
            "from keras.models import load_model",
            "",
            "model = load_model(\"\"\"" + dlHome + checkpointPath + "\"\"\")",
            "predict_data = read_parquet(\"\"\"" + dataPath + "\"\"\").values",
            "",
            "predict_result = model.predict(predict_data, batch_size=32)",
            "",
            "result_data = [tuple(float(v) for v in p) for p in predict_result]",
            "result_column = ['predict_' + str(i) for i in range(len(result_data[0]))]",
            "",
            outDFAlias + " = pd.DataFrame(result_data, columns=result_column)"
        };

        String predictScript = KerasScriptUtil.getKerasPredictScript(outDFAlias, param);

        assertThat(predictScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void canMakePredictScriptWithDefaultBatchSize() {
        String outDFAlias = "result_df";
        String dlHome = Paths.get("/home/brightics/brightics/packages/dl").toString();
        String checkpointPath = Paths.get("/checkpoint/brightics@samsung.com/test/test-epoch_00-loss_1.58-accuracy_0.88.hdf5").toString();
        String dataPath = Paths.get("/home/brightics/brightics/packages/dl/data/preprocessed_x_test.npy").toString();

        JsonObject param = new JsonObject();
        param.addProperty("checkpointPath", checkpointPath);
        param.addProperty("inputDataPath", dataPath);

        String[] expected = new String[] {
            "from keras.models import load_model",
            "",
            "model = load_model(\"\"\"" + dlHome + checkpointPath + "\"\"\")",
            "predict_data = read_parquet(\"\"\"" + dataPath + "\"\"\").values",
            "",
            "predict_result = model.predict(predict_data)",
            "",
            "result_data = [tuple(float(v) for v in p) for p in predict_result]",
            "result_column = ['predict_' + str(i) for i in range(len(result_data[0]))]",
            "",
            outDFAlias + " = pd.DataFrame(result_data, columns=result_column)"
        };

        String predictScript = KerasScriptUtil.getKerasPredictScript(outDFAlias, param);

        assertThat(predictScript.split(LINE_SEPARATOR)).containsExactly(expected);
    }

    @Test
    public void whenCheckpointPathNotEnteredExpectException() {
        JsonObject param = new JsonObject();
        param.addProperty("inputDataPath", "input data path");

        assertThatThrownBy(() -> KerasScriptUtil.getKerasPredictScript("outDF", param))
                .hasMessage("'Checkpoint' is a required parameter.");
    }

    @Test
    public void whenInputDataPathNotEnteredExpectException() {
        JsonObject param = new JsonObject();
        param.addProperty("checkpointPath", "checkpoint path");

        assertThatThrownBy(() -> KerasScriptUtil.getKerasPredictScript("outDF", param))
                .hasMessage("'Input Data Path' is a required parameter.");
    }
}
