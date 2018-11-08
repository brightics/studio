package com.samsung.sds.brightics.server.common.util.keras.model;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.gson.JsonElement;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowLayerNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowWrapperNode;
import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Sets;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.KerasScriptUtil;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

public class KerasLayersTest {

    private JsonArray inputShape;

    @Before
    public void setUp() {
        inputShape = new JsonArray();
        inputShape.add("28");
        inputShape.add("28");
        inputShape.add("1");
    }

    @Test
    public void shouldReturnProperLayerInstanceWhenLayerNameStringIsGiven() {
        assertThat(KerasLayers.of("Dense")).isEqualTo(CoreLayers.Dense);
        assertThat(KerasLayers.of("Activation")).isEqualTo(CoreLayers.Activation);
        assertThat(KerasLayers.of("Dropout")).isEqualTo(CoreLayers.Dropout);
        assertThat(KerasLayers.of("Flatten")).isEqualTo(CoreLayers.Flatten);
        assertThat(KerasLayers.of("Reshape")).isEqualTo(CoreLayers.Reshape);
        assertThat(KerasLayers.of("Lambda")).isEqualTo(CoreLayers.Lambda);

        assertThat(KerasLayers.of("Conv1D")).isEqualTo(ConvolutionalLayers.Conv1D);
        assertThat(KerasLayers.of("Conv2D")).isEqualTo(ConvolutionalLayers.Conv2D);
        assertThat(KerasLayers.of("Conv2DTranspose")).isEqualTo(ConvolutionalLayers.Conv2DTranspose);
        assertThat(KerasLayers.of("UpSampling2D")).isEqualTo(ConvolutionalLayers.UpSampling2D);

        assertThat(KerasLayers.of("MaxPooling1D")).isEqualTo(PoolingLayers.MaxPooling1D);
        assertThat(KerasLayers.of("MaxPooling2D")).isEqualTo(PoolingLayers.MaxPooling2D);
        assertThat(KerasLayers.of("AveragePooling2D")).isEqualTo(PoolingLayers.AveragePooling2D);
        assertThat(KerasLayers.of("GlobalAveragePooling2D")).isEqualTo(PoolingLayers.GlobalAveragePooling2D);

        assertThat(KerasLayers.of("RNN")).isEqualTo(RecurrentLayers.RNN);
        assertThat(KerasLayers.of("GRU")).isEqualTo(RecurrentLayers.GRU);
        assertThat(KerasLayers.of("LSTM")).isEqualTo(RecurrentLayers.LSTM);

        assertThat(KerasLayers.of("Embedding")).isEqualTo(EmbeddingsLayers.Embedding);

        assertThat(KerasLayers.of("Add")).isEqualTo(MergeLayers.Add);
        assertThat(KerasLayers.of("Concatenate")).isEqualTo(MergeLayers.Concatenate);

        assertThat(KerasLayers.of("ELU")).isEqualTo(AdvancedActivationsLayers.ELU);
        assertThat(KerasLayers.of("LeakyReLU")).isEqualTo(AdvancedActivationsLayers.LeakyReLU);

        assertThat(KerasLayers.of("BatchNormalization")).isEqualTo(NormalizationLayers.BatchNormalization);

        assertThat(KerasLayers.of("Bidirectional")).isEqualTo(LayerWrappers.Bidirectional);

        assertThat(KerasLayers.of("VGG16")).isEqualTo(Applications.VGG16);
        assertThat(KerasLayers.of("ResNet50")).isEqualTo(Applications.ResNet50);
        assertThat(KerasLayers.of("InceptionV3")).isEqualTo(Applications.InceptionV3);
        assertThat(KerasLayers.of("InceptionResNetV2")).isEqualTo(Applications.InceptionResNetV2);
    }

    @Test
    public void shouldThrowExceptionWhenWrongLayerNameIsGiven() {
        assertThatExceptionOfType(Exception.class)
                .isThrownBy(() -> KerasLayers.of("Hello?"))
                .withMessage("Unsupported Keras layer passed 'Hello?'.");
    }

    @Test
    public void kerasUtilCanMakeKerasImportScriptWithLayersList() {
        String importScript = KerasScriptUtil.makeLayersImportScript(
                Sets.newHashSet(
                        CoreLayers.Dense,
                        ConvolutionalLayers.Conv2D,
                        PoolingLayers.MaxPooling2D,
                        RecurrentLayers.LSTM,
                        EmbeddingsLayers.Embedding,
                        PoolingLayers.AveragePooling2D,
                        PoolingLayers.GlobalAveragePooling2D,
                        Applications.InceptionV3,
                        Applications.InceptionResNetV2));

        String[] importLine = importScript.split(System.lineSeparator());

        assertThat(importLine).hasSize(6);

        Arrays.sort(importLine);
        checkImportModules(importLine[0], "keras.applications", Sets.newHashSet("InceptionResNetV2", "InceptionV3"));
        checkImportModules(importLine[1], "keras.layers.convolutional", Sets.newHashSet("Conv2D"));
        checkImportModules(importLine[2], "keras.layers.core", Sets.newHashSet("Dense"));
        checkImportModules(importLine[3], "keras.layers.embeddings", Sets.newHashSet("Embedding"));
        checkImportModules(importLine[4], "keras.layers.pooling", Sets.newHashSet("MaxPooling2D", "GlobalAveragePooling2D", "AveragePooling2D"));
        checkImportModules(importLine[5], "keras.layers.recurrent", Sets.newHashSet("LSTM"));
    }

    @Test
    public void whenSameLayersAreGivenThenImportScriptShouldHaveDistinctClassName() {
        String importScript = KerasScriptUtil.makeLayersImportScript(
                Sets.newHashSet(
                        CoreLayers.Dense,
                        CoreLayers.Activation,
                        CoreLayers.Dense,
                        CoreLayers.Dense,
                        CoreLayers.Flatten));

        checkImportModules(importScript, "keras.layers.core", Sets.newHashSet("Activation", "Flatten", "Dense"));
    }

    private void checkImportModules(String script, String module, Set<String> classes) {
        String[] importScripts = script.split(" ");

        assertThat(importScripts[0]).isEqualTo("from");
        assertThat(importScripts[1]).isEqualTo(module);
        assertThat(importScripts[2]).isEqualTo("import");

        List<String> importClasses = Arrays.stream(Arrays.copyOfRange(importScripts, 3, importScripts.length - 1))
                .map(className -> className.substring(0, className.length() - 1))
                .collect(Collectors.toList());
        importClasses.add(importScripts[importScripts.length - 1]);

        assertThat(importClasses).hasSameSizeAs(classes);
        assertThat(importClasses).containsExactlyInAnyOrderElementsOf(classes);
    }

    @Test
    public void testDenseLayerScript() {
        JsonObject denseArgs = new JsonObject();
        denseArgs.addProperty("units", "128");

        KerasFlowLayerNode dense = makeKerasFlowLayerNode("Dense", denseArgs);

        assertThat(dense.getLayerScript()).isEqualTo("Dense(units=128)");

        denseArgs.addProperty("units", "256");
        assertThat(dense.getLayerScript()).isEqualTo("Dense(units=256)");

        denseArgs.addProperty("activation", "");
        assertThat(dense.getLayerScript()).isEqualTo("Dense(units=256)");

        denseArgs.addProperty("activation", "None");
        assertThat(dense.getLayerScript()).isEqualTo("Dense(units=256, activation=None)");

        denseArgs.addProperty("activation", "softmax");
        assertThat(dense.getLayerScript()).isEqualTo("Dense(units=256, activation=\"\"\"softmax\"\"\")");
    }

    @Test
    public void testActivationLayerScript() {
        JsonObject activationArgs = new JsonObject();
        activationArgs.addProperty("activation", "relu");

        KerasFlowLayerNode activation = makeKerasFlowLayerNode("Activation", activationArgs);

        assertThat(activation.getLayerScript())
                .isEqualTo("Activation(activation=\"\"\"relu\"\"\")");

        activationArgs.addProperty("activation", "sigmoid");

        assertThat(activation.getLayerScript())
                .isEqualTo("Activation(activation=\"\"\"sigmoid\"\"\")");
    }

    @Test
    public void testDropoutLayerScript() {
        JsonObject dropoutArgs = new JsonObject();
        dropoutArgs.addProperty("rate", "0.8");

        KerasFlowLayerNode dropout = makeKerasFlowLayerNode("Dropout", dropoutArgs);

        assertThat(dropout.getLayerScript()).isEqualTo("Dropout(rate=0.8)");

        dropoutArgs.addProperty("rate", "0.0001");

        assertThat(dropout.getLayerScript()).isEqualTo("Dropout(rate=0.0001)");
    }

    @Test
    public void testFlattenLayerScript() {
        JsonObject flattenArgs = new JsonObject();

        KerasFlowLayerNode flatten = makeKerasFlowLayerNode("Flatten", flattenArgs);

        assertThat(flatten.getLayerScript()).isEqualTo("Flatten()");

        flattenArgs.addProperty("wrongArgs", "Hello");

        assertThat(flatten.getLayerScript()).isEqualTo("Flatten()");
    }

    @Test
    public void testReshapeLayerScript() {
        JsonObject reshapeArgs = new JsonObject();
        JsonArray targetShape = new JsonArray();
        targetShape.add("3");
        reshapeArgs.add("target_shape", targetShape);

        KerasFlowLayerNode reshape = makeKerasFlowLayerNode("Reshape", reshapeArgs);

        assertThat(reshape.getLayerScript()).isEqualTo("Reshape(target_shape=(3,))");

        targetShape.add("5");

        assertThat(reshape.getLayerScript()).isEqualTo("Reshape(target_shape=(3,5))");
    }

    @Test
    public void testLambdaLayerScript() {
        JsonObject lambdaArgs = new JsonObject();
        lambdaArgs.addProperty("function", "lambda x: x ** 2");

        KerasFlowLayerNode lambda = makeKerasFlowLayerNode("Lambda", lambdaArgs);

        assertThat(lambda.getLayerScript()).isEqualTo("Lambda(function=lambda x: x ** 2)");
    }

    @Test
    public void lambdaLayerScriptParamDoesNotAppearInLayerScript() {
        String[] antirectifier = new String[] {
                "from keras import backend as K",
                "def antirectifier(x):",
                "    x -= K.mean(x, axis=1, keepdims=True)",
                "    x = K.12_normalize(x, axis=1)",
                "    pos = K.relu(x)",
                "    neg = K.relu(-x)",
                "    return K.concatenate([pos, neg], axis=1)"};

        JsonObject lambdaArgs = new JsonObject();
        lambdaArgs.addProperty("script", Arrays.stream(antirectifier).collect(Collectors.joining("\n")));
        lambdaArgs.addProperty("function", "antirectifier");

        KerasFlowLayerNode lambda = makeKerasFlowLayerNode("Lambda", lambdaArgs);

        assertThat(lambda.getLayerScript()).isEqualTo("Lambda(function=antirectifier)");
    }

    @Test
    public void testConv2DLayerScript() {
        JsonObject conv2dArgs = new JsonObject();
        // required
        conv2dArgs.addProperty("filters", "32");

        JsonArray conv2dKernelSize = new JsonArray();
        conv2dKernelSize.add("3");
        conv2dKernelSize.add("3");
        conv2dArgs.add("kernel_size", conv2dKernelSize);

        conv2dArgs.add("strides", conv2dKernelSize);

        conv2dArgs.addProperty("padding", "valid");

        conv2dArgs.addProperty("activation", "softmax");

        conv2dArgs.addProperty("use_bias", "True");

        KerasFlowLayerNode conv2d = makeKerasFlowLayerNode("Conv2D", conv2dArgs);
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"valid\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dArgs.addProperty("padding", "casual");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"casual\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dArgs.addProperty("padding", "same");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dArgs.addProperty("activation", "None");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=None, use_bias=True)");


        conv2dArgs.addProperty("activation", "relu");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)");

        // optional
        conv2dArgs.addProperty("data_format", "channels_last");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_last\"\"\")");

        conv2dArgs.addProperty("data_format", "channels_first");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\")");

        conv2dArgs.add("dilation_rate", conv2dKernelSize);
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3))");

        conv2dArgs.addProperty("kernel_initializer", "glorot_uniform");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"glorot_uniform\"\"\")");

        conv2dArgs.addProperty("kernel_initializer", "RandomUniform");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\")");

        conv2dArgs.addProperty("bias_initializer", "zeros");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"zeros\"\"\")");

        conv2dArgs.addProperty("bias_initializer", "orthogonal");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\")");

        conv2dArgs.addProperty("kernel_regularizer", "l1");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1\"\"\")");

        conv2dArgs.addProperty("kernel_regularizer", "l1_l2");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dArgs.addProperty("bias_regularizer", "l1_l2");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dArgs.addProperty("activity_regularizer", "l1_l2");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dArgs.addProperty("kernel_constraint", "max_norm()");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"max_norm()\"\"\")");

        conv2dArgs.addProperty("kernel_constraint", "min_max_norm()");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\")");

        conv2dArgs.addProperty("bias_constraint", "min_max_norm()");
        assertThat(conv2d.getLayerScript())
                .isEqualTo("Conv2D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\", bias_constraint=\"\"\"min_max_norm()\"\"\")");
    }

    @Test
    public void testConv1DLayerScript() {
        JsonObject conv1dArgs = new JsonObject();
        // required
        conv1dArgs.addProperty("filters", "32");

        JsonArray conv1dKernelSize = new JsonArray();
        conv1dKernelSize.add("3");
        conv1dKernelSize.add("3");
        conv1dArgs.add("kernel_size", conv1dKernelSize);

        conv1dArgs.add("strides", conv1dKernelSize);

        conv1dArgs.addProperty("padding", "valid");

        conv1dArgs.addProperty("activation", "softmax");

        conv1dArgs.addProperty("use_bias", "True");

        KerasFlowLayerNode conv1d = makeKerasFlowLayerNode("Conv1D", conv1dArgs);
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"valid\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv1dArgs.addProperty("padding", "casual");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"casual\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv1dArgs.addProperty("padding", "same");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv1dArgs.addProperty("activation", "None");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=None, use_bias=True)");


        conv1dArgs.addProperty("activation", "relu");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)");

        // optional
        conv1dArgs.add("dilation_rate", conv1dKernelSize);
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3))");

        conv1dArgs.addProperty("kernel_initializer", "glorot_uniform");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"glorot_uniform\"\"\")");

        conv1dArgs.addProperty("kernel_initializer", "RandomUniform");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\")");

        conv1dArgs.addProperty("bias_initializer", "zeros");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"zeros\"\"\")");

        conv1dArgs.addProperty("bias_initializer", "orthogonal");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\")");

        conv1dArgs.addProperty("kernel_regularizer", "l1");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1\"\"\")");

        conv1dArgs.addProperty("kernel_regularizer", "l1_l2");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\")");

        conv1dArgs.addProperty("bias_regularizer", "l1_l2");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\")");

        conv1dArgs.addProperty("activity_regularizer", "l1_l2");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\")");

        conv1dArgs.addProperty("kernel_constraint", "max_norm()");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"max_norm()\"\"\")");

        conv1dArgs.addProperty("kernel_constraint", "min_max_norm()");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\")");

        conv1dArgs.addProperty("bias_constraint", "min_max_norm()");
        assertThat(conv1d.getLayerScript())
                .isEqualTo("Conv1D(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\", bias_constraint=\"\"\"min_max_norm()\"\"\")");
    }

    @Test
    public void testConv2DTransposeLayerScript() {
        JsonObject conv2dTransposeArgs = new JsonObject();
        // required
        conv2dTransposeArgs.addProperty("filters", "32");

        JsonArray conv2dTransposeKernelSize = new JsonArray();
        conv2dTransposeKernelSize.add("3");
        conv2dTransposeKernelSize.add("3");
        conv2dTransposeArgs.add("kernel_size", conv2dTransposeKernelSize);

        conv2dTransposeArgs.add("strides", conv2dTransposeKernelSize);

        conv2dTransposeArgs.addProperty("padding", "valid");

        conv2dTransposeArgs.addProperty("activation", "softmax");

        conv2dTransposeArgs.addProperty("use_bias", "True");

        KerasFlowLayerNode conv2dTranspose = makeKerasFlowLayerNode("Conv2DTranspose", conv2dTransposeArgs);
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"valid\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dTransposeArgs.addProperty("padding", "casual");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"casual\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dTransposeArgs.addProperty("padding", "same");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"softmax\"\"\", use_bias=True)");

        conv2dTransposeArgs.addProperty("activation", "None");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=None, use_bias=True)");


        conv2dTransposeArgs.addProperty("activation", "relu");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True)");

        // optional
        conv2dTransposeArgs.addProperty("data_format", "channels_last");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_last\"\"\")");

        conv2dTransposeArgs.addProperty("data_format", "channels_first");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\")");

        conv2dTransposeArgs.add("dilation_rate", conv2dTransposeKernelSize);
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3))");

        conv2dTransposeArgs.addProperty("kernel_initializer", "glorot_uniform");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"glorot_uniform\"\"\")");

        conv2dTransposeArgs.addProperty("kernel_initializer", "RandomUniform");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\")");

        conv2dTransposeArgs.addProperty("bias_initializer", "zeros");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"zeros\"\"\")");

        conv2dTransposeArgs.addProperty("bias_initializer", "orthogonal");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\")");

        conv2dTransposeArgs.addProperty("kernel_regularizer", "l1");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1\"\"\")");

        conv2dTransposeArgs.addProperty("kernel_regularizer", "l1_l2");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dTransposeArgs.addProperty("bias_regularizer", "l1_l2");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dTransposeArgs.addProperty("activity_regularizer", "l1_l2");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\")");

        conv2dTransposeArgs.addProperty("kernel_constraint", "max_norm()");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"max_norm()\"\"\")");

        conv2dTransposeArgs.addProperty("kernel_constraint", "min_max_norm()");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\")");

        conv2dTransposeArgs.addProperty("bias_constraint", "min_max_norm()");
        assertThat(conv2dTranspose.getLayerScript())
                .isEqualTo("Conv2DTranspose(filters=32, kernel_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", activation=\"\"\"relu\"\"\", use_bias=True, data_format=\"\"\"channels_first\"\"\", dilation_rate=(3,3), kernel_initializer=\"\"\"RandomUniform\"\"\", bias_initializer=\"\"\"orthogonal\"\"\", kernel_regularizer=\"\"\"l1_l2\"\"\", bias_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", kernel_constraint=\"\"\"min_max_norm()\"\"\", bias_constraint=\"\"\"min_max_norm()\"\"\")");
    }

    @Test
    public void testUpsampling2DLayerScript() {
        JsonObject upSampling2dArgs = new JsonObject();
        // required
        JsonArray upSampling2DKernelSize = new JsonArray();
        upSampling2DKernelSize.add("3");
        upSampling2DKernelSize.add("3");
        upSampling2dArgs.add("size", upSampling2DKernelSize);

        // optional
        upSampling2dArgs.addProperty("data_format", "channels_last");

        KerasFlowLayerNode upSampling2D = makeKerasFlowLayerNode("UpSampling2D", upSampling2dArgs);
        assertThat(upSampling2D.getLayerScript())
                .isEqualTo("UpSampling2D(size=(3,3), data_format=\"\"\"channels_last\"\"\")");

        upSampling2dArgs.addProperty("data_format", "channels_first");
        assertThat(upSampling2D.getLayerScript())
                .isEqualTo("UpSampling2D(size=(3,3), data_format=\"\"\"channels_first\"\"\")");
    }

    @Test
    public void testCropping3DLayerScript() {
        JsonObject cropping3dArgs = new JsonObject();
        // required
        JsonArray cropping = new JsonArray();
        cropping.add("1");
        cropping.add("1");
        JsonArray croppingParam = new JsonArray();
        croppingParam.add(cropping);
        croppingParam.add(cropping);
        croppingParam.add(cropping);
        cropping3dArgs.add("cropping", croppingParam);

        // optional
        cropping3dArgs.addProperty("data_format", "channels_last");

        KerasFlowLayerNode cropping3D = makeKerasFlowLayerNode("Cropping3D", cropping3dArgs);
        assertThat(cropping3D.getLayerScript())
                .isEqualTo("Cropping3D(cropping=((1,1),(1,1),(1,1)), data_format=\"\"\"channels_last\"\"\")");

        cropping3dArgs.addProperty("data_format", "channels_first");
        assertThat(cropping3D.getLayerScript())
                .isEqualTo("Cropping3D(cropping=((1,1),(1,1),(1,1)), data_format=\"\"\"channels_first\"\"\")");
    }

    @Test
    public void testMaxPooling1DLayerScript() {
        JsonObject maxPooling1dArgs = new JsonObject();

        KerasFlowLayerNode maxPooling1d = makeKerasFlowLayerNode("MaxPooling1D", maxPooling1dArgs);

        // required
        maxPooling1dArgs.addProperty("pool_size", "3");
        maxPooling1dArgs.addProperty("strides", "3");
        maxPooling1dArgs.addProperty("padding", "valid");

        assertThat(maxPooling1d.getLayerScript())
                .isEqualTo("MaxPooling1D(pool_size=3, strides=3, padding=\"\"\"valid\"\"\")");

        maxPooling1dArgs.addProperty("padding", "same");
        assertThat(maxPooling1d.getLayerScript())
                .isEqualTo("MaxPooling1D(pool_size=3, strides=3, padding=\"\"\"same\"\"\")");
    }

    @Test
    public void testMaxPooling2DLayerScript() {
        JsonObject maxPooling2dArgs = new JsonObject();

        KerasFlowLayerNode maxPooling2d = makeKerasFlowLayerNode("MaxPooling2D", maxPooling2dArgs);

        // required
        JsonArray maxPooling2dPoolSize = new JsonArray();
        maxPooling2dPoolSize.add("3");
        maxPooling2dPoolSize.add("3");
        maxPooling2dArgs.add("pool_size", maxPooling2dPoolSize);
        maxPooling2dArgs.add("strides", maxPooling2dPoolSize);
        maxPooling2dArgs.addProperty("padding", "valid");

        assertThat(maxPooling2d.getLayerScript())
                .isEqualTo("MaxPooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"valid\"\"\")");

        maxPooling2dArgs.addProperty("padding", "same");
        assertThat(maxPooling2d.getLayerScript())
                .isEqualTo("MaxPooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\")");

        // optional
        maxPooling2dArgs.addProperty("data_format", "channels_last");
        assertThat(maxPooling2d.getLayerScript())
                .isEqualTo("MaxPooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", data_format=\"\"\"channels_last\"\"\")");

        maxPooling2dArgs.addProperty("data_format", "channels_first");
        assertThat(maxPooling2d.getLayerScript())
                .isEqualTo("MaxPooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", data_format=\"\"\"channels_first\"\"\")");
    }

    @Test
    public void testAveragePooling2DLayerScript() {
        JsonObject averagePooling2dArgs = new JsonObject();

        KerasFlowLayerNode averagePooling2d = makeKerasFlowLayerNode("AveragePooling2D", averagePooling2dArgs);

        // required
        JsonArray maxPooling2dPoolSize = new JsonArray();
        maxPooling2dPoolSize.add("3");
        maxPooling2dPoolSize.add("3");
        averagePooling2dArgs.add("pool_size", maxPooling2dPoolSize);
        averagePooling2dArgs.add("strides", maxPooling2dPoolSize);
        averagePooling2dArgs.addProperty("padding", "valid");

        assertThat(averagePooling2d.getLayerScript())
                .isEqualTo("AveragePooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"valid\"\"\")");

        averagePooling2dArgs.addProperty("padding", "same");
        assertThat(averagePooling2d.getLayerScript())
                .isEqualTo("AveragePooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\")");

        // optional
        averagePooling2dArgs.addProperty("data_format", "channels_last");
        assertThat(averagePooling2d.getLayerScript())
                .isEqualTo("AveragePooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", data_format=\"\"\"channels_last\"\"\")");

        averagePooling2dArgs.addProperty("data_format", "channels_first");
        assertThat(averagePooling2d.getLayerScript())
                .isEqualTo("AveragePooling2D(pool_size=(3,3), strides=(3,3), padding=\"\"\"same\"\"\", data_format=\"\"\"channels_first\"\"\")");
    }

    @Test
    public void testGlobalAveragePooling2DLayerScript() {
        JsonObject globalAveragePooling2dArgs = new JsonObject();

        KerasFlowLayerNode globalAveragePooling2d = makeKerasFlowLayerNode("GlobalAveragePooling2D", globalAveragePooling2dArgs);

        assertThat(globalAveragePooling2d.getLayerScript())
                .isEqualTo("GlobalAveragePooling2D()");

        globalAveragePooling2dArgs.addProperty("data_format", "channels_first");
        assertThat(globalAveragePooling2d.getLayerScript())
                .isEqualTo("GlobalAveragePooling2D(data_format=\"\"\"channels_first\"\"\")");
    }

    @Test
    public void testRNNLayerScript() {
        JsonObject rnnArgs = new JsonObjectBuilder()
                .add("cell", new JsonObjectBuilder()
                        .add("name", "SimpleRNNCell")
                        .add("param", new JsonObjectBuilder()
                                .add("units", "10")
                                .add("activation", "tanh")
                                .get())
                        .get())
                .get();

        KerasFlowLayerNode rnn = makeKerasFlowWrapperNode("RNN", rnnArgs, "cell");

        assertThat(rnn.getLayerScript()).isEqualTo("RNN(cell=SimpleRNNCell(units=10, activation=\"\"\"tanh\"\"\"))");

        rnnArgs.addProperty("unroll", "True");
        assertThat(rnn.getLayerScript()).isEqualTo("RNN(cell=SimpleRNNCell(units=10, activation=\"\"\"tanh\"\"\"), unroll=True)");
    }

    @Test
    public void rnnLayerScriptParamDoesNotAppearInLayerScript() {
        String[] antirectifier = new String[]{
                "class MinimalRNNCell(keras.layers.Layer):" +
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
                        "        return output, [output]",
        };

        JsonObject rnnArgs = new JsonObjectBuilder()
                .add("cell", new JsonObjectBuilder()
                        .add("name", "Custom")
                        .add("param", new JsonObjectBuilder()
                                .add("script", Arrays.stream(antirectifier).collect(Collectors.joining("\n")))
                                .add("function", "MinimalRNNCell(32)")
                                .get())
                        .get())
                .get();

        KerasFlowLayerNode rnn = makeKerasFlowWrapperNode("RNN", rnnArgs, "cell");

        assertThat(rnn.getLayerScript()).isEqualTo("RNN(cell=MinimalRNNCell(32))");
    }

    @Test
    public void testGRULayerScript() {
        JsonObject gruArgs = new JsonObject();
        gruArgs.addProperty("units", 100);

        KerasFlowLayerNode gru = makeKerasFlowLayerNode("GRU", gruArgs);

        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100)");

        gruArgs.addProperty("activation", "sigmoid");
        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100, activation=\"\"\"sigmoid\"\"\")");

        gruArgs.addProperty("recurrent_activation", "tanh");
        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\")");

        gruArgs.addProperty("return_sequences", "true");
        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\", return_sequences=True)");

        gruArgs.addProperty("dropout", "0.3");
        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\", dropout=0.3, return_sequences=True)");

        gruArgs.addProperty("dropout", "0.8");
        assertThat(gru.getLayerScript())
                .isEqualTo("GRU(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\", dropout=0.8, return_sequences=True)");
    }

    @Test
    public void testLSTMLayerScript() {
        JsonObject lstmArgs = new JsonObject();
        lstmArgs.addProperty("units", 100);

        KerasFlowLayerNode lstm = makeKerasFlowLayerNode("LSTM", lstmArgs);

        assertThat(lstm.getLayerScript())
                .isEqualTo("LSTM(units=100)");

        lstmArgs.addProperty("activation", "sigmoid");
        assertThat(lstm.getLayerScript())
                .isEqualTo("LSTM(units=100, activation=\"\"\"sigmoid\"\"\")");

        lstmArgs.addProperty("recurrent_activation", "tanh");
        assertThat(lstm.getLayerScript())
                .isEqualTo("LSTM(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\")");

        lstmArgs.addProperty("return_sequences", "true");
        assertThat(lstm.getLayerScript())
                .isEqualTo("LSTM(units=100, activation=\"\"\"sigmoid\"\"\", recurrent_activation=\"\"\"tanh\"\"\", return_sequences=True)");
    }

    @Test
    public void testEmbeddingLayerScript() {
        // required
        JsonObject embeddingArgs = new JsonObject();
        embeddingArgs.addProperty("input_dim", "5000");
        embeddingArgs.addProperty("output_dim", "32");
        embeddingArgs.addProperty("input_length", "100");

        KerasFlowLayerNode embedding = makeKerasFlowLayerNode("Embedding", embeddingArgs);

        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100)");

        // optional
        embeddingArgs.addProperty("embeddings_initializer", "randomnormal");
        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100, embeddings_initializer=\"\"\"randomnormal\"\"\")");

        embeddingArgs.addProperty("embeddings_regularizer", "l1_l2");
        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100, embeddings_initializer=\"\"\"randomnormal\"\"\", embeddings_regularizer=\"\"\"l1_l2\"\"\")");

        embeddingArgs.addProperty("activity_regularizer", "l1_l2");
        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100, embeddings_initializer=\"\"\"randomnormal\"\"\", embeddings_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\")");

        embeddingArgs.addProperty("embeddings_constraint", "non_neg");
        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100, embeddings_initializer=\"\"\"randomnormal\"\"\", embeddings_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", embeddings_constraint=\"\"\"non_neg\"\"\")");

        embeddingArgs.addProperty("mask_zero", "true");
        assertThat(embedding.getLayerScript())
                .isEqualTo("Embedding(input_dim=5000, output_dim=32, input_length=100, embeddings_initializer=\"\"\"randomnormal\"\"\", embeddings_regularizer=\"\"\"l1_l2\"\"\", activity_regularizer=\"\"\"l1_l2\"\"\", embeddings_constraint=\"\"\"non_neg\"\"\", mask_zero=True)");

    }

    @Test
    public void testAddScript() {
        KerasFlowLayerNode add = makeKerasFlowLayerNode("Add", new JsonObject());

        assertThat(add.getLayerScript()).isEqualTo("Add()");
    }

    @Test
    public void testConcatenateScript() {
        JsonObject concatenateArgs = new JsonObject();

        KerasFlowLayerNode concatenate = makeKerasFlowLayerNode("Concatenate", concatenateArgs);

        assertThat(concatenate.getLayerScript())
                .isEqualTo("Concatenate()");

        concatenateArgs.addProperty("axis", "-1");
        assertThat(concatenate.getLayerScript())
                .isEqualTo("Concatenate(axis=-1)");
    }

    @Test
    public void testLeakyReLULayerScript() {
        JsonObject leakyReLUArgs = new JsonObject();

        KerasFlowLayerNode leakyReLU = makeKerasFlowLayerNode("LeakyReLU", leakyReLUArgs);

        assertThat(leakyReLU.getLayerScript())
                .isEqualTo("LeakyReLU()");

        leakyReLUArgs.addProperty("alpha", "0.3");
        assertThat(leakyReLU.getLayerScript())
                .isEqualTo("LeakyReLU(alpha=0.3)");
    }

    @Test
    public void testELULayerScript() {
        JsonObject eluArgs = new JsonObject();

        KerasFlowLayerNode elu = makeKerasFlowLayerNode("ELU", eluArgs);

        assertThat(elu.getLayerScript())
                .isEqualTo("ELU()");

        eluArgs.addProperty("alpha", "0.3");
        assertThat(elu.getLayerScript())
                .isEqualTo("ELU(alpha=0.3)");
    }

    @Test
    public void testBidirectionalLayerScript() {
        JsonObject bidirectionalArgs = new JsonObjectBuilder()
                .add("layer", new JsonObjectBuilder()
                        .add("name", "LSTM")
                        .add("param", new JsonObjectBuilder()
                                .add("units", "10")
                                .add("return_sequences", "True")
                                .get())
                        .get())
                .get();

        KerasFlowLayerNode bidirectional = makeKerasFlowWrapperNode("Bidirectional", bidirectionalArgs, "layer");

        assertThat(bidirectional.getLayerScript()).isEqualTo("Bidirectional(layer=LSTM(units=10, return_sequences=True))");

        bidirectionalArgs.addProperty("merge_mode", "concat");
        assertThat(bidirectional.getLayerScript()).isEqualTo("Bidirectional(layer=LSTM(units=10, return_sequences=True), merge_mode=\"\"\"concat\"\"\")");
    }

    @Test
    public void testInceptionV3Script() {
        JsonObject inceptionV3Args = new JsonObject();

        KerasFlowLayerNode inceptionV3 = makeKerasFlowLayerNode("InceptionV3", inceptionV3Args);

        assertThat(inceptionV3.getLayerScript())
                .isEqualTo("InceptionV3()");

        inceptionV3Args.addProperty("include_top", "false");
        assertThat(inceptionV3.getLayerScript())
                .isEqualTo("InceptionV3(include_top=False)");

        inceptionV3Args.addProperty("weights", "None");
        assertThat(inceptionV3.getLayerScript())
                .isEqualTo("InceptionV3(include_top=False, weights=None)");
    }

    @Test
    public void testInceptionResNetV2Script() {
        JsonObject inceptionResNetV2Args = new JsonObject();

        KerasFlowLayerNode inceptionResNetV2 = makeKerasFlowLayerNode("InceptionResNetV2", inceptionResNetV2Args);

        assertThat(inceptionResNetV2.getLayerScript())
                .isEqualTo("InceptionResNetV2()");

        inceptionResNetV2Args.addProperty("include_top", "false");
        assertThat(inceptionResNetV2.getLayerScript())
                .isEqualTo("InceptionResNetV2(include_top=False)");

        inceptionResNetV2Args.addProperty("weights", "None");
        assertThat(inceptionResNetV2.getLayerScript())
                .isEqualTo("InceptionResNetV2(include_top=False, weights=None)");
    }

    @Test
    public void testBatchNormalizationLayerScript() {
        JsonObject batchNormalizationArgs = new JsonObject();

        KerasFlowLayerNode batchNormalization = makeKerasFlowLayerNode("BatchNormalization", batchNormalizationArgs);

        // required
        batchNormalizationArgs.addProperty("axis", "-1");
        batchNormalizationArgs.addProperty("momentum", "0.99");
        batchNormalizationArgs.addProperty("epsilon", "0.001");
        batchNormalizationArgs.addProperty("center", "true");
        batchNormalizationArgs.addProperty("scale", "true");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True)");

        // optional
        batchNormalizationArgs.addProperty("beta_initializer", "zeros");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\")");

        batchNormalizationArgs.addProperty("gamma_initializer", "ones");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\")");

        batchNormalizationArgs.addProperty("moving_mean_initializer", "zeros");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\")");

        batchNormalizationArgs.addProperty("moving_variance_initializer", "ones");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\", moving_variance_initializer=\"\"\"ones\"\"\")");

        batchNormalizationArgs.addProperty("beta_regularizer", "l1_l2");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\", moving_variance_initializer=\"\"\"ones\"\"\", beta_regularizer=\"\"\"l1_l2\"\"\")");

        batchNormalizationArgs.addProperty("gamma_regularizer", "l1_l2");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\", moving_variance_initializer=\"\"\"ones\"\"\", beta_regularizer=\"\"\"l1_l2\"\"\", gamma_regularizer=\"\"\"l1_l2\"\"\")");

        batchNormalizationArgs.addProperty("beta_constraint", "l1_l2");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\", moving_variance_initializer=\"\"\"ones\"\"\", beta_regularizer=\"\"\"l1_l2\"\"\", gamma_regularizer=\"\"\"l1_l2\"\"\", beta_constraint=\"\"\"l1_l2\"\"\")");

        batchNormalizationArgs.addProperty("gamma_constraint", "l1_l2");
        assertThat(batchNormalization.getLayerScript())
                .isEqualTo("BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001, center=True, scale=True, beta_initializer=\"\"\"zeros\"\"\", gamma_initializer=\"\"\"ones\"\"\", moving_mean_initializer=\"\"\"zeros\"\"\", moving_variance_initializer=\"\"\"ones\"\"\", beta_regularizer=\"\"\"l1_l2\"\"\", gamma_regularizer=\"\"\"l1_l2\"\"\", beta_constraint=\"\"\"l1_l2\"\"\", gamma_constraint=\"\"\"l1_l2\"\"\")");

    }

    @Test
    public void testOneHotLayerScript() {
        JsonObject oneHotArgs = new JsonObject();

        KerasFlowLayerNode oneHot = makeKerasFlowLayerNode("one_hot", oneHotArgs);

        // required
        oneHotArgs.addProperty("text", "I go to school");
        oneHotArgs.addProperty("n", "10");
        assertThat(oneHot.getLayerScript())
                .isEqualTo("one_hot(text=\"\"\"I go to school\"\"\", n=10)");

        // optional
        oneHotArgs.addProperty("filters", "\'!\\\"#$%&()*+,-./:;<=>?@[\\\\]^_`{|}~\'");
        assertThat(oneHot.getLayerScript())
                .isEqualTo("one_hot(text=\"\"\"I go to school\"\"\", n=10, filters=\"\"\"\'!\\\"#$%&()*+,-./:;<=>?@[\\\\]^_`{|}~\'\"\"\")");
        oneHotArgs.addProperty("lower", "true");
        assertThat(oneHot.getLayerScript())
                .isEqualTo("one_hot(text=\"\"\"I go to school\"\"\", n=10, filters=\"\"\"\'!\\\"#$%&()*+,-./:;<=>?@[\\\\]^_`{|}~\'\"\"\", lower=True)");
        oneHotArgs.addProperty("split", ",");
        assertThat(oneHot.getLayerScript())
                .isEqualTo("one_hot(text=\"\"\"I go to school\"\"\", n=10, filters=\"\"\"\'!\\\"#$%&()*+,-./:;<=>?@[\\\\]^_`{|}~\'\"\"\", lower=True, split=\"\"\",\"\"\")");
    }

    @Test
    public void whenLayerParameterObjectHaveBlankValueExpectThrowException() {
        JsonObject denseArgs = new JsonObject();
        denseArgs.addProperty("units", "");
        denseArgs.addProperty("activation", "relu");

        KerasFlowLayerNode dense = makeKerasFlowLayerNode("Dense", denseArgs);

        assertThatExceptionOfType(Exception.class)
                .isThrownBy(() -> dense.getLayerScript())
                .withMessage("Error: Dense layer 'Units' is a required parameter.");
    }

    @Test
    public void makeKerasLayerScriptWithInputShape() {
        JsonObject denseArgs = new JsonObject();
        denseArgs.addProperty("units", "128");
        denseArgs.addProperty("activation", "relu");
        denseArgs.add("input_shape", inputShape);

        KerasFlowLayerNode dense = makeKerasFlowLayerNode("Dense", denseArgs);

        assertThat(dense.getLayerScript())
                .isEqualTo("Dense(units=128, activation=\"\"\"relu\"\"\", input_shape=(28,28,1))");
    }

    @Test
    public void whenKerasLayerHasNoArgumentsCanMakeLayerScriptWithInputShape() {
        JsonObject flattenArgs = new JsonObject();
        flattenArgs.add("input_shape", inputShape);

        KerasFlowLayerNode flatten = makeKerasFlowLayerNode("Flatten", flattenArgs);

        assertThat(flatten.getLayerScript()).isEqualTo("Flatten(input_shape=(28,28,1))");
    }

    private KerasFlowLayerNode makeKerasFlowLayerNode(String operation, JsonObject param) {
        JsonObject func = new JsonObject();
        func.addProperty("name", operation);
        func.add("param", param);

        return new KerasFlowLayerNode("fid", func);
    }

    private KerasFlowWrapperNode makeKerasFlowWrapperNode(String operation, JsonObject param, String wrapper) {
        JsonObject func = new JsonObject();
        func.addProperty("name", operation);
        func.add("param", param);

        return new KerasFlowWrapperNode("fid", func, wrapper);
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
}
