package com.samsung.sds.brightics.agent.context.python;

import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import org.junit.Before;
import org.junit.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class PythonScriptTypeTest {

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

    @Before
    public void setUp() {
        ThreadLocalContext.put("user", "brightics");
    }

    @Test
    public void testDLPythonScript() {
        String script = "from keras.models import Input, Model\n" +
                "from keras.layers.pooling import MaxPooling2D\n" +
                "from keras.layers.convolutional import Conv2D\n" +
                "from keras.layers.core import Dropout, Flatten, Dense, Activation\n" +
                "\n" +
                "X_train = read_parquet(\\\"\\\"\\\"x_train.parquet\\\"\\\"\\\")\n" +
                "Y_train = read_parquet(\\\"\\\"\\\"y_train.parquet\\\"\\\"\\\")\n" +
                "\n" +
                CUSTOM_PYTHON_SCRIPT +
                "\n" +
                "\n" +
                "input_layer = Input(shape=(28,28,1), name=\\\"\\\"\\\"input_layer\\\"\\\"\\\")" +
                "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\\\"\\\"\\\"valid\\\"\\\"\\\", activation=\\\"\\\"\\\"relu\\\"\\\"\\\", use_bias=True)(input_layer)" +
                "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\\\"\\\"\\\"valid\\\"\\\"\\\", activation=\\\"\\\"\\\"relu\\\"\\\"\\\", use_bias=True)(x)" +
                "x = MaxPooling2D(pool_size=(2,2), strides=(2,2), padding=\\\"\\\"\\\"valid\\\"\\\"\\\")(x)" +
                "x = Dropout(rate=0.5)(x)" +
                "x = Flatten()(x)" +
                "x = Dense(units=128, activation=\\\"\\\"\\\"relu\\\"\\\"\\\")(x)" +
                "x = Dropout(rate=0.5)(x)" +
                "x = Dense(units=10, activation=\\\"\\\"\\\"softmax\\\"\\\"\\\")(x)" +
                "output_layer = Activation(activation=\\\"\\\"\\\"softmax\\\"\\\"\\\", name=\\\"\\\"\\\"output_layer\\\"\\\"\\\")(x)" +
                "" +
                "model = Model(inputs=input_layer, outputs=output_layer)" +
                "" +
                "model.compile(optimizer=\\\"\\\"\\\"adam\\\"\\\"\\\", loss=\\\"\\\"\\\"categorical_crossentropy\\\"\\\"\\\", metrics=[\\\"\\\"\\\"accuracy\\\"\\\"\\\"])" +
                "" +
                "import sys" +
                "sys.path.append(\\\"\\\"\\\"/home/brightics/brightics/packages/dl/modules/\\\"\\\"\\\")" +
                "" +
                "from brightics_keras_logger import BrighticsLogger" +
                "brightics_logger = BrighticsLogger(\\\"\\\"\\\"/home/brightics/brightics/packages/dl/log/jid.log\\\"\\\"\\\")" +
                "" +
                "from brightics_deeplearning_util import make_checkpoint_dir" +
                "created_checkpoint_dir = make_checkpoint_dir(\\\"\\\"\\\"/home/brightics/brightics/packages/dl/checkpoint/\\\"\\\"\\\", \\\"\\\"\\\"brightics@samsung.com\\\"\\\"\\\", \\\"\\\"\\\"test\\\"\\\"\\\")" +
                "" +
                "from keras.callbacks import ModelCheckpoint" +
                "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \\\"\\\"\\\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-accuracy_{acc:.2f}.hdf5\\\"\\\"\\\")" +
                "" +
                "model.fit({\\\"\\\"\\\"input_layer\\\"\\\"\\\": X_train}, {\\\"\\\"\\\"output_layer\\\"\\\"\\\": Y_train}, batch_size=32, epochs=10, callbacks=[brightics_logger, checkpoint], verbose=0)";

        String expected = "from keras.models import Input, Model\n" +
                "from keras.layers.pooling import MaxPooling2D\n" +
                "from keras.layers.convolutional import Conv2D\n" +
                "from keras.layers.core import Dropout, Flatten, Dense, Activation\n" +
                "\n" +
                "X_train = read_parquet(\"\"\"x_train.parquet\"\"\")\n" +
                "Y_train = read_parquet(\"\"\"y_train.parquet\"\"\")\n" +
                "\n" +
                CUSTOM_PYTHON_SCRIPT +
                "\n" +
                "\n" +
                "input_layer = Input(shape=(28,28,1), name=\"\"\"input_layer\"\"\")" +
                "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)(input_layer)" +
                "x = Conv2D(filters=32, kernel_size=(3,3), strides=(1,1), padding=\"\"\"valid\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)(x)" +
                "x = MaxPooling2D(pool_size=(2,2), strides=(2,2), padding=\"\"\"valid\"\"\")(x)" +
                "x = Dropout(rate=0.5)(x)" +
                "x = Flatten()(x)" +
                "x = Dense(units=128, activation=\"\"\"relu\"\"\")(x)" +
                "x = Dropout(rate=0.5)(x)" +
                "x = Dense(units=10, activation=\"\"\"softmax\"\"\")(x)" +
                "output_layer = Activation(activation=\"\"\"softmax\"\"\", name=\"\"\"output_layer\"\"\")(x)" +
                "" +
                "model = Model(inputs=input_layer, outputs=output_layer)" +
                "" +
                "model.compile(optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"])" +
                "" +
                "import sys" +
                "sys.path.append(\"\"\"/home/brightics/brightics/packages/dl/modules/\"\"\")" +
                "" +
                "from brightics_keras_logger import BrighticsLogger" +
                "brightics_logger = BrighticsLogger(\"\"\"/home/brightics/brightics/packages/dl/log/jid.log\"\"\")" +
                "" +
                "from brightics_deeplearning_util import make_checkpoint_dir" +
                "created_checkpoint_dir = make_checkpoint_dir(\"\"\"/home/brightics/brightics/packages/dl/checkpoint/\"\"\", \"\"\"brightics@samsung.com\"\"\", \"\"\"test\"\"\")" +
                "" +
                "from keras.callbacks import ModelCheckpoint" +
                "checkpoint = ModelCheckpoint(filepath = created_checkpoint_dir + \"\"\"/test-epoch_{epoch:02d}-loss_{loss:.2f}-accuracy_{acc:.2f}.hdf5\"\"\")" +
                "" +
                "model.fit({\"\"\"input_layer\"\"\": X_train}, {\"\"\"output_layer\"\"\": Y_train}, batch_size=32, epochs=10, callbacks=[brightics_logger, checkpoint], verbose=0)";

        TaskMessageWrapper message = new TaskMessageWrapper(ExecuteTaskMessage.newBuilder().
                setTaskId(UUID.randomUUID().toString()).
                setName("DLPythonScript").
                setParameters("{\"script\": \"" + script + "\"}").
                setAttributes("{\"mid\": \"mid\"}").
                build());

        assertThat(PythonScriptType.DLPythonScript.getSource(message)).isEqualTo(expected);
    }

    @Test
    public void testDLPredict() {
        String script = "from keras.models import load_model\n" +
                "\n" +
                "model = load_model(\\\"\\\"\\\"test-epoch_00-loss_1.58-accuracy_0.88.hdf5\\\"\\\"\\\")\n" +
                "predict_data = read_parquet(\\\"\\\"\\\"/data/preprocessed_x_test.npy\\\"\\\"\\\")\n" +
                "\n" +
                "predict_result = model.predict(predict_data, batch_size=32)\n" +
                "\n" +
                "result_data = [tuple(float(v) for v in p) for p in predict_result]\n" +
                "result_column = ['predict_' + str(i) for i in range(len(result_data[0]))]\n" +
                "\n" +
                "result_df = pd.DataFrame(result_data, columns=result_column)";

        String expected = "from keras.models import load_model\n" +
                "\n" +
                "model = load_model(\"\"\"test-epoch_00-loss_1.58-accuracy_0.88.hdf5\"\"\")\n" +
                "predict_data = read_parquet(\"\"\"/data/preprocessed_x_test.npy\"\"\")\n" +
                "\n" +
                "predict_result = model.predict(predict_data, batch_size=32)\n" +
                "\n" +
                "result_data = [tuple(float(v) for v in p) for p in predict_result]\n" +
                "result_column = ['predict_' + str(i) for i in range(len(result_data[0]))]\n" +
                "\n" +
                "result_df = pd.DataFrame(result_data, columns=result_column)\n" +
                "put_data('/brightics/mid/out', result_df, r\"\"\"Script Label\"\"\")\n" +
                "write_data('/brightics/mid/out', '/brightics/mid/out')";

        TaskMessageWrapper message = new TaskMessageWrapper(ExecuteTaskMessage.newBuilder().
                setTaskId(UUID.randomUUID().toString()).
                setName("DLPredict").
                setParameters("{\"out-table-alias\": [result_df], " +
                        "\"script\": \"" + script + "\"}").
                setAttributes("{\"mid\": \"mid\", " +
                        "\"outData\": [out]}").
                build());

        assertThat(PythonScriptType.DLPredict.getSource(message)).isEqualTo(expected);
    }
}
