package com.samsung.sds.brightics.server.common.util.keras;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.google.gson.JsonElement;
import org.junit.Before;
import org.junit.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KerasModelScriptGeneratorTest {

    private static final String LINE_SEPARATOR = System.getProperty("line.separator");

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

    JsonObject testJsonObject;

    String inputPath = "data.parquet";

    @Before
    public void setUp() {
        testJsonObject = getMNISTSampleJson();
    }

    @Test
    public void testKerasSequentialScriptWhenGenerationModeExport() throws Exception {
        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(testJsonObject);
        String kerasSequentialScript = generator.getSequentialScript();

        String[] seqModelLines = kerasSequentialScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Sequential",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
            "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
            "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
            "Y_train = input_df[[\"\"\"label\"\"\"]].values",
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
            "model.add(Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\"))",
            "",
            "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10)"
        };

        assertThat(seqModelLines).containsExactly(expected);
    }

    @Test
    public void testKerasSequentialScriptWhenGenerationModeTrain() throws Exception {
        KerasModelScriptGenerator generator = new KerasTrainScriptGenerator(testJsonObject, "jid");
        String kerasSequentialScript = generator.getSequentialScript();

        String[] seqModelLines = kerasSequentialScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Sequential",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
            "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
            "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
            "Y_train = input_df[[\"\"\"label\"\"\"]].values",
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
            "model.add(Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\"))",
            "",
            "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")",
            "",
            "from brightics_keras_logger import BrighticsLogger",
            "brightics_logger = BrighticsLogger(\"\"\"/home/brightics/brightics/packages/dl/log/jid.log\"\"\")",
            "",
            "from brightics_deeplearning_util import make_checkpoint_dir",
            "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics@samsung.com\"\"\", \"\"\"test\"\"\")",
            "",
            "from keras.callbacks import ModelCheckpoint",
            "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-accuracy_{acc:.2f}.hdf5\"\"\")",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10, callbacks=[brightics_logger, checkpoint], verbose=0)"
        };

        assertThat(seqModelLines).containsExactly(expected);
    }

    @Test
    public void testKerasSequentialScriptWhenGenerationModeModelCheck() throws Exception {
        KerasModelScriptGenerator generator = new KerasSummaryScriptGenerator(testJsonObject, "jid");
        String kerasSequentialScript = generator.getSequentialScript();

        String[] seqModelLines = kerasSequentialScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Sequential",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
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
            "model.add(Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\"))",
            "",
            "summary_log = []",
            "model.summary(line_length=200, print_fn=summary_log.append)",
            "",
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")",
            "",
            "from brightics_deeplearning_util import write_summary",
            "write_summary(\"\"\"/home/brightics/brightics/packages/dl/log/jid.summary\"\"\", summary_log)"
        };

        assertThat(seqModelLines).containsExactly(expected);
    }

    @Test
    public void testKerasFunctionalScriptWhenGenerationModeExport() throws Exception {
        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(testJsonObject);
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
            "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
            "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
            "Y_train = input_df[[\"\"\"label\"\"\"]].values",
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
            "model = Model(inputs=input_layer, outputs=output_layer)",
            "",
            "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testKerasFunctionalScriptWhenGenerationModeTrain() throws Exception {
        KerasModelScriptGenerator generator = new KerasTrainScriptGenerator(testJsonObject, "jid");
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
            "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
            "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
            "Y_train = input_df[[\"\"\"label\"\"\"]].values",
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
            "model = Model(inputs=input_layer, outputs=output_layer)",
            "",
            "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")",
            "",
            "from brightics_keras_logger import BrighticsLogger",
            "brightics_logger = BrighticsLogger(\"\"\"/home/brightics/brightics/packages/dl/log/jid.log\"\"\")",
            "",
            "from brightics_deeplearning_util import make_checkpoint_dir",
            "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics@samsung.com\"\"\", \"\"\"test\"\"\")",
            "",
            "from keras.callbacks import ModelCheckpoint",
            "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-accuracy_{acc:.2f}.hdf5\"\"\")",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10, callbacks=[brightics_logger, checkpoint], verbose=0)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testKerasFunctionalScriptWhenGenerationModeModelCheck() throws Exception {
        KerasModelScriptGenerator generator = new KerasSummaryScriptGenerator(testJsonObject, "jid");
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.layers.pooling import MaxPooling2D",
            "from keras.layers.convolutional import Conv2D",
            "from keras.layers.core import Dropout, Flatten, Dense, Activation",
            "",
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
            "model = Model(inputs=input_layer, outputs=output_layer)",
            "",
            "summary_log = []",
            "model.summary(line_length=200, print_fn=summary_log.append)",
            "",
            "import sys",
            "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")",
            "",
            "from brightics_deeplearning_util import write_summary",
            "write_summary(\"\"\"/home/brightics/brightics/packages/dl/log/jid.summary\"\"\", summary_log)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testMultipleInputAndOutputModelFunctionalScript() throws Exception {
        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(makeKerasFunctionalModelSampleJson());
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.layers.merge import Concatenate",
            "from keras.layers.embeddings import Embedding",
            "from keras.layers.recurrent import LSTM",
            "from keras.layers.core import Dense",
            "",
            "input_df = read_parquet(\"\"\"headline\"\"\")",
            "X_train = input_df[[\"\"\"data\"\"\"]].values",
            "Y_train = input_df[[\"\"\"labels\"\"\"]].values",
            "",
            "input_df_2 = read_parquet(\"\"\"additional\"\"\")",
            "X_train_2 = input_df_2[[\"\"\"data\"\"\"]].values",
            "Y_train_2 = input_df_2[[\"\"\"labels\"\"\"]].values",
            "",
            "input_layer = Input(shape=(100,), name=\"\"\"input_layer\"\"\")",
            "x = Embedding(input_dim=10000, output_dim=512, input_length=100)(input_layer)",
            "x = LSTM(units=32)(x)",
            "output_layer_2 = Dense(units=1, activation=\"\"\"sigmoid\"\"\", name=\"\"\"output_layer_2\"\"\")(x)",
            "",
            "input_layer_2 = Input(shape=(5,), name=\"\"\"input_layer_2\"\"\")",
            "x_2 = Concatenate()([x, input_layer_2])",
            "x_2 = Dense(units=64, activation=\"\"\"relu\"\"\")(x_2)",
            "x_2 = Dense(units=64, activation=\"\"\"relu\"\"\")(x_2)",
            "x_2 = Dense(units=64, activation=\"\"\"relu\"\"\")(x_2)",
            "output_layer = Dense(units=1, activation=\"\"\"sigmoid\"\"\", name=\"\"\"output_layer\"\"\")(x_2)",
            "",
            "model = Model(inputs=[input_layer, input_layer_2], outputs=[output_layer, output_layer_2])",
            "",
            "model.compile(optimizer=\"\"\"rmsprop\"\"\", loss=\"\"\"binary_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train, \"\"\"input_layer_2\"\"\": X_train_2}, {\"\"\"output_layer\"\"\": Y_train, \"\"\"output_layer_2\"\"\": Y_train_2}, batch_size=32, epochs=50)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testSimpleResNetBlock() throws Exception {
        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(makeBlockModelSampleJson());
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.layers.merge import Concatenate",
            "from keras.layers.convolutional import ZeroPadding2D, Conv2D",
            "from keras.layers.core import Activation",
            "",
            "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
            "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
            "Y_train = input_df[[\"\"\"label\"\"\"]].values",
            "",
            "input_layer = Input(shape=(28,28,1), name=\"\"\"input_layer\"\"\")",
            "x = ZeroPadding2D(padding=(3,3))(input_layer)",
            "x = Conv2D(filters=8, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"linear\"\"\", use_bias=True)(x)",
            "x = Activation(activation=\"\"\"relu\"\"\")(x)",
            "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"linear\"\"\", use_bias=True)(x)",
            "x = Activation(activation=\"\"\"relu\"\"\")(x)",
            "",
            "x_2 = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"linear\"\"\", use_bias=True)(x)",
            "output_layer = Concatenate(name=\"\"\"output_layer\"\"\")([x, x_2])",
            "",
            "model = Model(inputs=input_layer, outputs=output_layer)",
            "",
            "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void testPNIDInceptionResNetV2Script() throws Exception {
        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(makePNIDInceptionResNetV2Json());
        String kerasFunctionalScript = generator.getFunctionalScript();

        String[] funcModelLines = kerasFunctionalScript.split(LINE_SEPARATOR);

        String[] expected = new String[] {
            "from keras.models import Input, Model",
            "from keras.applications import InceptionResNetV2",
            "from keras.layers.pooling import GlobalAveragePooling2D",
            "from keras.layers.core import Dense",
            "",
            "from keras.preprocessing.image import ImageDataGenerator",
            "",
            "idg = ImageDataGenerator(rescale=1./255)",
            "",
            "X_train = idg.flow_from_directory(directory=\"\"\"data_ori/test/\"\"\", target_size=(300,300), class_mode=\"\"\"categorical\"\"\", batch_size=10, shuffle=True)",
            "",
            "idg_2 = ImageDataGenerator(rescale=1./255)",
            "",
            "X_train_2 = idg_2.flow_from_directory(directory=\"\"\"data_ori/train/\"\"\", target_size=(300,300), class_mode=\"\"\"categorical\"\"\", batch_size=10, shuffle=True)",
            "",
            "input_layer_2 = InceptionResNetV2(include_top=False, weights=\"\"\"imagenet\"\"\", input_shape=(300,300,3))",
            "x_2 = GlobalAveragePooling2D()(input_layer_2.output)",
            "x_2 = Dense(units=1024, activation=\"\"\"relu\"\"\")(x_2)",
            "output_layer_2 = Dense(units=5, activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer_2\"\"\")(x_2)",
            "",
            "model = Model(inputs=input_layer_2.input, outputs=output_layer_2)",
            "",
            "model.compile(optimizer=\"\"\"rmsprop\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
            "",
            "model.fit_generator(X_train_2, validation_data=X_train, steps_per_epoch=1320, epochs=5, validation_steps=5)"
        };

        assertThat(funcModelLines).containsExactly(expected);
    }

    @Test
    public void someKerasLayersCouldHaveAUserInputScript() throws Exception {
        JsonArray functions = new JsonArray();

        new LayerBuilder()
                .add("input_path", inputPath)
                .add("train_data_column", new JsonArrayBuilder().add("data1").add("data2").get())
                .add("train_label_column", new JsonArrayBuilder().add("label").get())
                .add("input_shape", new JsonArrayBuilder().add("28").add("28").add("1").get())
                .addFunctions(functions, "DlLoad", "dlLoadFid");

        new LayerBuilder()
                .add("units", "10")
                .addFunctions(functions, "Dense", "denseFid");

        String lambdaScript = Stream.of("from keras import backend as K",
                "def antirectifier(x):",
                "    x -= K.mean(X, axis=1, keepdims=True)",
                "    x = K.12_normalize(x, axis=1)",
                "    pos = K.relu(x)",
                "    neg = K.relu(-x)",
                "return K.concatenate([pos, neg], axis=1)").collect(Collectors.joining("\n"));

        new LayerBuilder()
                .add("script", lambdaScript)
                .add("function", "antirectifier")
                .addFunctions(functions, "Lambda", "lambdaFid");

        String minimalRNNCellScript = Stream.of("class MinimalRNNCell(keras.layers.Layer):" +
                        "" +
                        "    def __init__(self, units, **kwargs):" +
                        "        self.units = units" +
                        "        self.state_size = units" +
                        "        super(MinimalRNNCell, self).__init__(**kwargs)" +
                        "" +
                        "    def build(self, input_shape):" +
                        "        self.kernel = self.add_weight(shape=(input_shape[-1], self.units)," +
                        "                                      initializer='uniform'," +
                        "                                      name='kernel')" +
                        "        self.recurrent_kernel = self.add_weight(" +
                        "            shape=(self.units, self.units)," +
                        "            initializer='uniform'," +
                        "            name='recurrent_kernel')" +
                        "        self.built = True" +
                        "" +
                        "    def call(self, inputs, states):" +
                        "        prev_output = states[0]" +
                        "        h = K.dot(inputs, self.kernel)" +
                        "        output = h + K.dot(prev_output, self.recurrent_kernel)" +
                        "        return output, [output]").collect(Collectors.joining("\n"));

        new LayerBuilder()
                .add("cell", new JsonObjectBuilder()
                        .add("name", "Custom")
                        .add("param", new JsonObjectBuilder()
                                .add("script", minimalRNNCellScript)
                                .add("function", "MinimalRNNCell(32)")
                                .get())
                        .get())
                .addFunctions(functions, "RNN", "rnnFid");

        new LayerBuilder()
                .add("layer", new JsonObjectBuilder()
                        .add("name", "LSTM")
                        .add("param", new JsonObjectBuilder()
                                .add("units", "10")
                                .add("return_sequences", "True")
                                .get())
                        .get())
                .addFunctions(functions, "Bidirectional", "bidirectionalFid");

        new LayerBuilder()
                .add("train_data", "dlLoadFid")
                .addFunctions(functions, "Output", "outputFid");

        JsonArray links = new LinkBuilder()
                .add("dlLoadFid", "denseFid")
                .add("denseFid", "lambdaFid")
                .add("lambdaFid", "rnnFid")
                .add("rnnFid", "bidirectionalFid")
                .add("bidirectionalFid", "outputFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "categorical_crossentropy")
                .add("optimizer", "adam")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "10")
                .add("checkPointGroupName", "test").get();

        JsonObject model = new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variable", new JsonObject())
                .add("user", "brightics@samsung.com")
                .get();

        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(model);

        String[] funcModelLines = generator.getFunctionalScript().split(LINE_SEPARATOR);

        assertThat(funcModelLines).containsExactly("from keras.models import Input, Model",
                "from keras.layers.wrappers import Bidirectional",
                "from keras.layers.recurrent import RNN, LSTM",
                "from keras.layers.core import Dense, Lambda",
                "",
                "input_df = read_parquet(\"\"\"" + inputPath + "\"\"\")",
                "X_train = input_df[[\"\"\"data1\"\"\",\"\"\"data2\"\"\"]].values",
                "Y_train = input_df[[\"\"\"label\"\"\"]].values",
                "",
                "input_layer = Input(shape=(28,28,1), name=\"\"\"input_layer\"\"\")",
                "x = Dense(units=10)(input_layer)",
                "",
                lambdaScript,
                "",
                "x = Lambda(function=antirectifier)(x)",
                "",
                minimalRNNCellScript,
                "",
                "x = RNN(cell=MinimalRNNCell(32))(x)",
                "output_layer = Bidirectional(layer=LSTM(units=10, return_sequences=True), name=\"\"\"output_layer\"\"\")(x)",
                "",
                "model = Model(inputs=input_layer, outputs=output_layer)",
                "",
                "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
                "",
                "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10)");
    }

    @Test
    public void testCircleShapeModel() throws Exception {
        JsonArray functions = new JsonArray();

        new LayerBuilder()
                .add("loadType", "npy")
                .add("train_data_path", new JsonArrayBuilder().add("/data/1D_input_x.npy").get())
                .add("train_label_path", new JsonArrayBuilder().add("/data/1D_input_y.npy").get())
                .add("input_shape", new JsonArrayBuilder().add("100").get())
                .addFunctions(functions, "DlLoad", "dlLoadFid");

        new LayerBuilder()
                .add("input_dim", "100")
                .add("output_dim", "32")
                .add("input_length", "100")
                .addFunctions(functions, "Embedding", "embedding1Fid");

        new LayerBuilder()
                .add("padding", "2")
                .addFunctions(functions, "ZeroPadding1D", "zeroPadding1d1Fid");

        new LayerBuilder()
                .add("filters", "10")
                .add("kernel_size", new JsonArrayBuilder().add("2").get())
                .add("strides", new JsonArrayBuilder().add("2").get())
                .add("padding", "valid")
                .add("activation", "None")
                .add("use_bias", "true")
                .addFunctions(functions, "Conv1D", "conv1d1Fid");

        new LayerBuilder()
                .add("cropping", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Cropping1D", "cropping1d1Fid");

        new LayerBuilder()
                .add("size", "2")
                .addFunctions(functions, "UpSampling1D", "upSampling1d1Fid");

        new LayerBuilder()
                .add("pool_size", "2")
                .add("strides", "None")
                .add("padding", "valid")
                .addFunctions(functions, "MaxPooling1D", "maxPooling1d1Fid");

        new LayerBuilder()
                .add("input_dim", "100")
                .add("output_dim", "32")
                .add("input_length", "100")
                .addFunctions(functions, "Embedding", "embedding2Fid");

        new LayerBuilder()
                .add("padding", "2")
                .addFunctions(functions, "ZeroPadding1D", "zeroPadding1d2Fid");

        new LayerBuilder()
                .add("filters", "10")
                .add("kernel_size", new JsonArrayBuilder().add("2").get())
                .add("strides", new JsonArrayBuilder().add("2").get())
                .add("padding", "valid")
                .add("activation", "None")
                .add("use_bias", "true")
                .addFunctions(functions, "Conv1D", "conv1d2Fid");

        new LayerBuilder()
                .add("cropping", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Cropping1D", "cropping1d2Fid");

        new LayerBuilder()
                .add("size", "2")
                .addFunctions(functions, "UpSampling1D", "upSampling1d2Fid");

        new LayerBuilder()
                .add("pool_size", "2")
                .add("strides", "None")
                .add("padding", "valid")
                .addFunctions(functions, "MaxPooling1D", "maxPooling1d2Fid");

        new LayerBuilder()
                .addFunctions(functions, "Add", "addFid");

        new LayerBuilder()
                .add("units", "5")
                .add("activation", "softmax")
                .addFunctions(functions, "Dense", "denseFid");

        new LayerBuilder()
                .add("train_data", "dlLoadFid")
                .addFunctions(functions, "Output", "outputFid");

        JsonArray links = new LinkBuilder()
                .add("dlLoadFid", "embedding1Fid")
                .add("dlLoadFid", "embedding2Fid")
                .add("embedding1Fid", "zeroPadding1d1Fid")
                .add("zeroPadding1d1Fid", "conv1d1Fid")
                .add("conv1d1Fid", "cropping1d1Fid")
                .add("cropping1d1Fid", "upSampling1d1Fid")
                .add("upSampling1d1Fid", "maxPooling1d1Fid")
                .add("embedding2Fid", "zeroPadding1d2Fid") // start 2
                .add("zeroPadding1d2Fid", "conv1d2Fid")
                .add("conv1d2Fid", "cropping1d2Fid")
                .add("cropping1d2Fid", "upSampling1d2Fid")
                .add("upSampling1d2Fid", "maxPooling1d2Fid")
                .add("maxPooling1d1Fid", "addFid")
                .add("maxPooling1d2Fid", "addFid")
                .add("addFid", "denseFid")
                .add("denseFid", "outputFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "mean_squared_error")
                .add("optimizer", "adam")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "3")
                .add("checkPointGroupName", "test").get();

        JsonObject model = new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variable", new JsonObject())
                .add("user", "brightics@samsung.com")
                .get();

        KerasModelScriptGenerator generator = new KerasExportScriptGenerator(model);

        String[] funcModelLines = generator.getFunctionalScript().split(LINE_SEPARATOR);

        assertThat(funcModelLines).containsExactly("from keras.models import Input, Model",
                "from keras.layers.merge import Add",
                "from keras.layers.pooling import MaxPooling1D",
                "from keras.layers.embeddings import Embedding",
                "from keras.layers.convolutional import ZeroPadding1D, Conv1D, Cropping1D, UpSampling1D",
                "from keras.layers.core import Dense",
                "",
                "import numpy as np",
                "",
                "X_train = np.load(\"\"\"/data/1D_input_x.npy\"\"\")",
                "Y_train = np.load(\"\"\"/data/1D_input_y.npy\"\"\")",
                "",
                "input_layer = Input(shape=(100,), name=\"\"\"input_layer\"\"\")",
                "x = Embedding(input_dim=100, output_dim=32, input_length=100)(input_layer)",
                "x = ZeroPadding1D(padding=2)(x)",
                "x = Conv1D(filters=10, kernel_size=(2,), strides=(2,), padding=\"\"\"valid\"\"\", activation=None, use_bias=True)(x)",
                "x = Cropping1D(cropping=(1,1))(x)",
                "x = UpSampling1D(size=2)(x)",
                "x = MaxPooling1D(pool_size=2, strides=None, padding=\"\"\"valid\"\"\")(x)",
                "",
                "x_2 = Embedding(input_dim=100, output_dim=32, input_length=100)(input_layer)",
                "x_2 = ZeroPadding1D(padding=2)(x_2)",
                "x_2 = Conv1D(filters=10, kernel_size=(2,), strides=(2,), padding=\"\"\"valid\"\"\", activation=None, use_bias=True)(x_2)",
                "x_2 = Cropping1D(cropping=(1,1))(x_2)",
                "x_2 = UpSampling1D(size=2)(x_2)",
                "x_2 = MaxPooling1D(pool_size=2, strides=None, padding=\"\"\"valid\"\"\")(x_2)",
                "x = Add()([x, x_2])",
                "output_layer = Dense(units=5, activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\")(x)",
                "",
                "model = Model(inputs=input_layer, outputs=output_layer)",
                "",
                "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"mean_squared_error\"\"\", metrics=[\"\"\"accuracy\"\"\"])",
                "",
                "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=3)");
    }

    @Test
    public void inputActivityShouldBeAnIOType() {
        testJsonObject.get("functions").getAsJsonArray().remove(0);
        testJsonObject.get("links").getAsJsonArray().remove(0);

        assertThatThrownBy(() -> new KerasExportScriptGenerator(testJsonObject))
                .hasMessage("Input activity should be an I/O type. (DL Load or ImageDataGenerator)");
    }

    @Test
    public void whenTrainDataPathNotEnteredExpectException() {
        JsonObject dlLoad = testJsonObject.get("functions").getAsJsonArray().get(0).getAsJsonObject();

        dlLoad.get("param").getAsJsonObject().remove("train_data_column");

        assertThatThrownBy(() -> new KerasExportScriptGenerator(testJsonObject))
                .hasMessage("DL Load activity 'Train Data' is a required parameter.");
    }

    @Test
    public void whenTrainLabelPathNotEnteredExpectException() {
        JsonObject dlLoad = testJsonObject.get("functions").getAsJsonArray().get(0).getAsJsonObject();
        dlLoad.get("param").getAsJsonObject().remove("train_label_column");

        assertThatThrownBy(() -> new KerasExportScriptGenerator(testJsonObject))
                .hasMessage("DL Load activity 'Train Label' is a required parameter.");
    }

    private JsonObject getMNISTSampleJson() {
        /* functions */
        JsonArray functions = new JsonArray();

        // load
        new LayerBuilder()
                .add("loadType", "hdfs")
                .add("input_path", inputPath)
                .add("train_data_column", new JsonArrayBuilder().add("data1").add("data2").get())
                .add("train_label_column", new JsonArrayBuilder().add("label").get())
                .add("input_shape", new JsonArrayBuilder().add("28").add("28").add("1").get())
                .addFunctions(functions, "DlLoad", "dlLoadFid");

        // python script
        new LayerBuilder()
                .add("script", CUSTOM_PYTHON_SCRIPT)
                .addFunctions(functions, "DLPythonScript", "dlPythonScriptFid");

        // conv2d 1
        new LayerBuilder()
                .add("filters", "32")
                .add("activation", "relu")
                .add("padding", "valid")
                .add("use_bias", "true")
                .add("kernel_size", new JsonArrayBuilder().add("3").add("3").get())
                .add("strides", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Conv2D", "conv2d1Fid");

        // conv2d 2
        new LayerBuilder()
                .add("filters", "32")
                .add("activation", "relu")
                .add("padding", "valid")
                .add("use_bias", "true")
                .add("kernel_size", new JsonArrayBuilder().add("3").add("3").get())
                .add("strides", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Conv2D", "conv2d2Fid");

        // MaxPooling2D
        new LayerBuilder()
                .add("padding", "valid")
                .add("pool_size", new JsonArrayBuilder().add("2").add("2").get())
                .add("strides", new JsonArrayBuilder().add("2").add("2").get())
                .addFunctions(functions, "MaxPooling2D", "maxPooling2dFid");

        // Dropout
        new LayerBuilder()
                .add("rate", "0.5")
                .addFunctions(functions, "Dropout", "dropout1Fid");

        // Flatten
        new LayerBuilder()
                .addFunctions(functions, "Flatten", "flattenFid");

        // Dense
        new LayerBuilder()
                .add("units", "128")
                .add("activation", "relu")
                .addFunctions(functions, "Dense", "dense1Fid");

        // Dropout
        new LayerBuilder()
                .add("rate", "0.5")
                .addFunctions(functions, "Dropout", "dropout2Fid");

        // Dense
        new LayerBuilder()
                .add("units", "10")
                .add("activation", "softmax")
                .addFunctions(functions, "Dense", "dense2Fid");

        // Activation
        new LayerBuilder()
                .add("activation", "softmax")
                .addFunctions(functions, "Activation", "activationFid");

        // Output
        new LayerBuilder()
                .add("train_data", "dlLoadFid")
                .addFunctions(functions, "Output", "outputFid");

        /* links */
        JsonArray links = new LinkBuilder()
                .add("dlLoadFid", "dlPythonScriptFid")
                .add("dlPythonScriptFid", "conv2d1Fid")
                .add("conv2d1Fid", "conv2d2Fid")
                .add("conv2d2Fid", "maxPooling2dFid")
                .add("maxPooling2dFid", "dropout1Fid")
                .add("dropout1Fid", "flattenFid")
                .add("flattenFid", "dense1Fid")
                .add("dense1Fid", "dropout2Fid")
                .add("dropout2Fid", "dense2Fid")
                .add("dense2Fid", "activationFid")
                .add("activationFid", "outputFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "categorical_crossentropy")
                .add("optimizer", "adam")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "10")
                .add("execution", "run")
                .add("checkPointGroupName", "test").get();

        return new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variable", new JsonObject())
                .add("user", "brightics@samsung.com")
                .get();
    }

    private JsonObject makeKerasFunctionalModelSampleJson() {
        /* functions */
        JsonArray functions = new JsonArray();

        // Main Input
        new LayerBuilder()
                .add("loadType", "hdfs")
                .add("input_path", "headline")
                .add("train_data_column", "data")
                .add("train_label_column", "labels")
                .add("input_shape", new JsonArrayBuilder().add("100").get())
                .addFunctions(functions, "DlLoad", "mainInputFid");

        // Auxiliary Input
        new LayerBuilder()
                .add("loadType", "hdfs")
                .add("input_path", "additional")
                .add("train_data_column", "data")
                .add("train_label_column", "labels")
                .add("input_shape", new JsonArrayBuilder().add("5").get())
                .addFunctions(functions, "DlLoad", "auxiliaryInputFid");

        // embedding
        new LayerBuilder()
                .add("output_dim", "512")
                .add("input_dim", "10000")
                .add("input_length", "100")
                .addFunctions(functions, "Embedding", "embeddingFid");

        // lstm
        new LayerBuilder()
                .add("units", "32")
                .addFunctions(functions, "LSTM", "lstmFid");

        // Dense
        new LayerBuilder()
                .add("units", "1")
                .add("activation", "sigmoid")
                .addFunctions(functions, "Dense", "dense1Fid");

        // Output
        new LayerBuilder()
                .add("train_data", "auxiliaryInputFid")
//                .add("loss", "binary_crossentropy")
                .addFunctions(functions, "Output", "auxiliaryOutputFid");

        // Concatenate
        new LayerBuilder()
                .addFunctions(functions, "Concatenate", "concatenateFid");

        // Dense2
        new LayerBuilder()
                .add("units", "64")
                .add("activation", "relu")
                .addFunctions(functions, "Dense", "dense2Fid");

        // Dense3
        new LayerBuilder()
                .add("units", "64")
                .add("activation", "relu")
                .addFunctions(functions, "Dense", "dense3Fid");

        // Dense4
        new LayerBuilder()
                .add("units", "64")
                .add("activation", "relu")
                .addFunctions(functions, "Dense", "dense4Fid");

        // Dense5
        new LayerBuilder()
                .add("units", "1")
                .add("activation", "sigmoid")
                .addFunctions(functions, "Dense", "dense5Fid");

        // Main Output
        new LayerBuilder()
                .add("train_data", "mainInputFid")
                .addFunctions(functions, "Output", "mainOutputFid");

        /* links */
        JsonArray links = new LinkBuilder()
                .add("mainInputFid", "embeddingFid")
                .add("embeddingFid", "lstmFid")
                .add("lstmFid", "dense1Fid")
                .add("dense1Fid", "auxiliaryOutputFid")
                .add("lstmFid", "concatenateFid")
                .add("auxiliaryInputFid", "concatenateFid")
                .add("concatenateFid", "dense2Fid")
                .add("dense2Fid", "dense3Fid")
                .add("dense3Fid", "dense4Fid")
                .add("dense4Fid", "dense5Fid")
                .add("dense5Fid", "mainOutputFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "binary_crossentropy")
                .add("optimizer", "rmsprop")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "50")
                .add("execution", "run")
                .add("checkPointGroupName", "test").get();

        /* model */
        return new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variable", new JsonObject())
                .add("user", "brightics@samsung.com")
                .get();
    }

    private JsonObject makeBlockModelSampleJson() {
        /* functions */
        JsonArray functions = new JsonArray();

        // load
        new LayerBuilder()
                .add("loadType", "hdfs")
                .add("input_path", inputPath)
                .add("train_data_column", new JsonArrayBuilder().add("data1").add("data2").get())
                .add("train_label_column", new JsonArrayBuilder().add("label").get())
                .add("input_shape", new JsonArrayBuilder().add("28").add("28").add("1").get())
                .addFunctions(functions, "DlLoad", "dlLoadFid");

        // Zero padding
        new LayerBuilder()
                .add("padding", new JsonArrayBuilder().add("3").add("3").get())
                .addFunctions(functions, "ZeroPadding2D", "zeroPadding2dFid");

        // conv2d 1
        new LayerBuilder()
                .add("filters", "8")
                .add("activation", "linear")
                .add("padding", "valid")
                .add("use_bias", "true")
                .add("kernel_size", new JsonArrayBuilder().add("3").add("3").get())
                .add("strides", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Conv2D", "conv2d1Fid");

        // activation 1
        new LayerBuilder()
                .add("activation", "relu")
                .addFunctions(functions, "Activation", "activation1Fid");

        // conv2d 2
        new LayerBuilder()
                .add("filters", "32")
                .add("activation", "linear")
                .add("padding", "valid")
                .add("use_bias", "true")
                .add("kernel_size", new JsonArrayBuilder().add("3").add("3").get())
                .add("strides", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Conv2D", "conv2d2Fid");

        // activation 2
        new LayerBuilder()
                .add("activation", "relu")
                .addFunctions(functions, "Activation", "activation2Fid");

        // shortcut
        new LayerBuilder()
                .add("filters", "32")
                .add("activation", "linear")
                .add("padding", "valid")
                .add("use_bias", "true")
                .add("kernel_size", new JsonArrayBuilder().add("3").add("3").get())
                .add("strides", new JsonArrayBuilder().add("1").add("1").get())
                .addFunctions(functions, "Conv2D", "conv2dShortcutFid");

        // Concatenate
        new LayerBuilder()
                .addFunctions(functions, "Concatenate", "concatenateFid");

        // Output
        new LayerBuilder()
                .add("train_data", "dlLoadFid")
                .addFunctions(functions, "Output", "outputFid");

        /* links */
        JsonArray links = new LinkBuilder()
                .add("dlLoadFid", "zeroPadding2dFid")
                .add("zeroPadding2dFid", "conv2d1Fid")
                .add("conv2d1Fid", "activation1Fid")
                .add("activation1Fid", "conv2d2Fid")
                .add("conv2d2Fid", "activation2Fid")
                .add("activation2Fid", "concatenateFid")
                .add("concatenateFid", "outputFid")
                .add("conv2d1Fid", "conv2dShortcutFid")
                .add("conv2dShortcutFid", "concatenateFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "categorical_crossentropy")
                .add("optimizer", "adam")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "10")
                .add("execution", "run")
                .add("checkPointGroupName", "test").get();

        return new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variables", new JsonObject())
                .add("user", "brightics@samsung.com").get();
    }

    private JsonObject makePNIDInceptionResNetV2Json() {
        JsonArray functions = new JsonArray();

        // idg parameters
        JsonArray idgMethod = new JsonArrayBuilder().add(JsonNull.INSTANCE).add("flow_from_directory").get();
        JsonArray idgInputShape = new JsonArrayBuilder().add("300").add("300").add("3").get();
        JsonArray idgTargetSize = new JsonArrayBuilder().add("300").add("300").get();

        // train idg
        JsonObject idgTrainFlowFromDirParam = new JsonObjectBuilder()
                .add("directory", "data_ori/train/")
                .add("target_size", idgTargetSize)
                .add("batch_size", "10")
                .add("shuffle", "true")
                .add("class_mode", "categorical").get();

        new LayerBuilder()
                .add("rescale", "1./255")
                .add("method", idgMethod)
                .add("input_shape", idgInputShape)
                .add("flow_from_directory", idgTrainFlowFromDirParam)
                .addFunctions(functions,"ImageDataGenerator", "idgTrainFid");

        // test idg
        JsonObject idgTestFlowFromDirParam = new JsonObjectBuilder()
                .add("directory", "data_ori/test/")
                .add("target_size", idgTargetSize)
                .add("batch_size", "10")
                .add("shuffle", "true")
                .add("class_mode", "categorical").get();

        new LayerBuilder()
                .add("rescale", "1./255")
                .add("method", idgMethod)
                .add("input_shape", idgInputShape)
                .add("flow_from_directory", idgTestFlowFromDirParam)
                .addFunctions(functions, "ImageDataGenerator", "idgTestFid");

        // InceptionResNetV2
        new LayerBuilder()
                .add("weights", "imagenet")
                .add("include_top", "false")
                .add("input_shape", idgInputShape)
                .addFunctions(functions, "InceptionResNetV2", "inceptionResNetV2Fid");

        // GlobalAveragePooling2D
        new LayerBuilder()
                .addFunctions(functions, "GlobalAveragePooling2D", "globalAveragePooling2dFid");

        // Dense
        new LayerBuilder()
                .add("units", "1024")
                .add("activation", "relu")
                .addFunctions(functions, "Dense", "dense1Fid");

        // Dense 2
        new LayerBuilder()
                .add("units", "5")
                .add("activation", "softmax")
                .addFunctions(functions, "Dense", "dense2Fid");

        // Output
        new LayerBuilder()
                .add("train_data", "idgTrainFid")
                .add("validation_data", "idgTestFid")
                .addFunctions(functions, "Output", "outputFid");

        /* links */
        JsonArray links = new LinkBuilder()
                .add("idgTrainFid", "inceptionResNetV2Fid")
                .add("idgTestFid", "inceptionResNetV2Fid")
                .add("inceptionResNetV2Fid", "globalAveragePooling2dFid")
                .add("globalAveragePooling2dFid", "dense1Fid")
                .add("dense1Fid", "dense2Fid")
                .add("dense2Fid", "outputFid").get();

        /* param */
        JsonObject param = new JsonObjectBuilder()
                .add("loss", "categorical_crossentropy")
                .add("optimizer", "rmsprop")
                .add("metrics", "accuracy")
                .add("batch_size", "32")
                .add("epochs", "5")
                .add("execution", "run")
                .add("checkPointGroupName", "test")
                .add("steps_per_epoch", "1320")
                .add("validation_steps", "5").get();

        return new JsonObjectBuilder()
                .add("functions", functions)
                .add("links", links)
                .add("param", param)
                .add("variables", new JsonObject())
                .add("user", "brightics@samsung.com").get();
    }

    private class LayerBuilder {
        JsonObject layer = new JsonObject();

        LayerBuilder() {
            layer.add("param", new JsonObject());
        }

        LayerBuilder add(String param, String value) {
            layer.getAsJsonObject("param").addProperty(param, value);
            return this;
        }

        LayerBuilder add(String param, JsonElement elem) {
            layer.getAsJsonObject("param").add(param, elem);
            return this;
        }

        void addFunctions(JsonArray functions, String name, String fid) {
            layer.addProperty("name", name);
            layer.addProperty("fid", fid);

            functions.add(layer);
        }
    }

    private class LinkBuilder {
        JsonArray links = new JsonArray();

        LinkBuilder add(String source, String target) {
            JsonObject link = new JsonObject();
            link.addProperty("sourceFid", source);
            link.addProperty("targetFid", target);

            links.add(link);

            return this;
        }

        JsonArray get() {
            return this.links;
        }
    }

    private class JsonObjectBuilder {
        JsonObject obj = new JsonObject();

        JsonObjectBuilder add(String name, String value) {
            obj.addProperty(name, value);
            return this;
        }

        JsonObjectBuilder add(String name, JsonElement value) {
            obj.add(name, value);
            return this;
        }

        JsonObject get() {
            return obj;
        }
    }

    private class JsonArrayBuilder {
        JsonArray arr = new JsonArray();

        JsonArrayBuilder add(String value) {
            arr.add(value);
            return this;
        }

        JsonArrayBuilder add(JsonElement value) {
            arr.add(value);
            return this;
        }

        JsonArray get() {
            return arr;
        }
    }
}
