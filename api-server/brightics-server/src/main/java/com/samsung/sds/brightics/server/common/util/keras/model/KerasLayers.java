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

package com.samsung.sds.brightics.server.common.util.keras.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.PythonScriptUtil;
import org.apache.commons.lang3.EnumUtils;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import org.apache.commons.lang3.exception.ExceptionUtils;

public interface KerasLayers {

    List<KerasParameters> EMPTY_LIST = new ArrayList<>();

    String getModuleName();
    String getClassName();
    List<KerasParameters> getRequiredParams();
    List<KerasParameters> getOptionalParams();

    void validate(JsonObject param);

    default boolean isApplications() {
        return false;
    }

    static <E extends Enum<E> & KerasLayers> KerasLayers of(String layer) {
        @SuppressWarnings("unchecked")
        Class<E>[] classes = new Class[]{
                CoreLayers.class
                , ConvolutionalLayers.class
                , PoolingLayers.class
                , RecurrentLayers.class
                , EmbeddingsLayers.class
                , MergeLayers.class
                , AdvancedActivationsLayers.class
                , NormalizationLayers.class
                , LayerWrappers.class
                , TextPreprocessing.class
                , Applications.class
        };

        return Arrays.stream(classes)
                .map(cl -> EnumUtils.getEnum(cl, layer))
                .filter(Objects::nonNull)
                .findFirst()
                .orElseThrow(() -> new BrighticsCoreException("4414", layer));
    }

    default String getLayerScript(JsonObject param) {
        try {
            String argumentsString = PythonScriptUtil.makePythonArgumentsString(getRequiredParams(), getOptionalParams(), param);
            return String.format("%s(%s)", getClassName(), argumentsString);
        } catch (Exception e) {
            throw new BrighticsCoreException("3102", String.format("%s layer %s", getClassName(), e.getMessage()))
                    .addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }
}

enum CoreLayers implements KerasLayers {

    Dense("Dense", Collections.singletonList(KerasParameterConstant.UNITS), Collections.singletonList(KerasParameterConstant.ACTIVATION)),
    Activation("Activation", Collections.singletonList(KerasParameterConstant.ACTIVATION)),
    Dropout("Dropout", Collections.singletonList(KerasParameterConstant.RATE)),
    Flatten("Flatten", EMPTY_LIST),
    Reshape("Reshape", Collections.singletonList(KerasParameterConstant.TARGET_SHAPE)),
    Lambda("Lambda"
            , Collections.singletonList(new KerasParameters("function", PythonTypes.STATEMENTS))
            , Arrays.asList(new KerasParameters("output_shape", PythonTypes.STATEMENTS)
                    , new KerasParameters("mask", PythonTypes.STR)
                    , new KerasParameters("arguments", PythonTypes.STR)));

    private static final String moduleName = "keras.layers.core";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    CoreLayers(String className, List<KerasParameters> requiredParams) {
        this(className, requiredParams, EMPTY_LIST);
    }

    CoreLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName(){
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum ConvolutionalLayers implements KerasLayers {

    Conv1D("Conv1D"
            , Arrays.asList(
            KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE,
            KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING,
            KerasParameterConstant.ACTIVATION, KerasParameterConstant.USE_BIAS)
            , Arrays.asList(KerasParameterConstant.DILATION_RATE,
            KerasParameterConstant.KERNEL_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER,
            KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER,
            KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT,
            KerasParameterConstant.BIAS_CONSTRAINT)),

    Conv2D("Conv2D"
            , Arrays.asList(
            KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE,
            KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING,
            KerasParameterConstant.ACTIVATION, KerasParameterConstant.USE_BIAS)
            , Arrays.asList(KerasParameterConstant.DATA_FORMAT, KerasParameterConstant.DILATION_RATE,
            KerasParameterConstant.KERNEL_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER,
            KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER,
            KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT,
            KerasParameterConstant.BIAS_CONSTRAINT)),
    Conv3D("Conv3D"
            , Arrays.asList(
            KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE,
            KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING,
            KerasParameterConstant.ACTIVATION, KerasParameterConstant.USE_BIAS)
            , Arrays.asList(KerasParameterConstant.DATA_FORMAT, KerasParameterConstant.DILATION_RATE,
            KerasParameterConstant.KERNEL_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER,
            KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER,
            KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT,
            KerasParameterConstant.BIAS_CONSTRAINT)),

    SeparableConv1D("SeparableConv1D"
            , Arrays.asList(KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE)
            , Arrays.asList(KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING, KerasParameterConstant.DATA_FORMAT
            , KerasParameterConstant.DILATION_RATE, KerasParameterConstant.DEPTH_MULTIPLIER, KerasParameterConstant.ACTIVATION
            , KerasParameterConstant.USE_BIAS, KerasParameterConstant.DEPTHWISE_INITIALIZER, KerasParameterConstant.POINTWISE_INITIALIZER
            , KerasParameterConstant.BIAS_INITIALIZER, KerasParameterConstant.DEPTHWISE_REGULARIZER, KerasParameterConstant.POINTWISE_REGULARIZER
            , KerasParameterConstant.BIAS_REGULARIZER, KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.DEPTHWISE_CONSTRAINT
            , KerasParameterConstant.POINTWISE_CONSTRAINT, KerasParameterConstant.BIAS_CONSTRAINT)),

    SeparableConv2D("SeparableConv2D"
            , Arrays.asList(KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE)
            , Arrays.asList(KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING, KerasParameterConstant.DATA_FORMAT
            , KerasParameterConstant.DEPTH_MULTIPLIER, KerasParameterConstant.ACTIVATION , KerasParameterConstant.USE_BIAS, KerasParameterConstant.DEPTHWISE_INITIALIZER
            , KerasParameterConstant.POINTWISE_INITIALIZER , KerasParameterConstant.BIAS_INITIALIZER, KerasParameterConstant.DEPTHWISE_REGULARIZER
            , KerasParameterConstant.POINTWISE_REGULARIZER , KerasParameterConstant.BIAS_REGULARIZER, KerasParameterConstant.ACTIVITY_REGULARIZER
            , KerasParameterConstant.DEPTHWISE_CONSTRAINT , KerasParameterConstant.POINTWISE_CONSTRAINT, KerasParameterConstant.BIAS_CONSTRAINT)),


    Conv2DTranspose("Conv2DTranspose"
            , Arrays.asList(
            KerasParameterConstant.FILTERS, KerasParameterConstant.KERNEL_SIZE,
            KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING,
            KerasParameterConstant.ACTIVATION, KerasParameterConstant.USE_BIAS)
            , Arrays.asList(KerasParameterConstant.DATA_FORMAT, KerasParameterConstant.DILATION_RATE,
            KerasParameterConstant.KERNEL_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER,
            KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER,
            KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT,
            KerasParameterConstant.BIAS_CONSTRAINT)),

    UpSampling1D("UpSampling1D"
            , Collections.singletonList(new KerasParameters("size", PythonTypes.NUMBER)), EMPTY_LIST),
    UpSampling2D("UpSampling2D"
           , Collections.singletonList(KerasParameterConstant.SIZE), Arrays.asList(KerasParameterConstant.DATA_FORMAT)),
    UpSampling3D("UpSampling3D"
            , Collections.singletonList(KerasParameterConstant.SIZE), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),

    Cropping1D("Cropping1D", Collections.singletonList(KerasParameterConstant.CROPPING), EMPTY_LIST),
    Cropping2D("Cropping2D", Collections.singletonList(KerasParameterConstant.CROPPING), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),
    Cropping3D("Cropping3D", Collections.singletonList(KerasParameterConstant.CROPPING), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),

    ZeroPadding1D("ZeroPadding1D", Collections.singletonList(new KerasParameters("padding", PythonTypes.NUMBER)), EMPTY_LIST),
    ZeroPadding2D("ZeroPadding2D", Collections.singletonList(new KerasParameters("padding", PythonTypes.TUPLE)), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),
    ZeroPadding3D("ZeroPadding3D", Collections.singletonList(new KerasParameters("padding", PythonTypes.TUPLE)), Collections.singletonList(KerasParameterConstant.DATA_FORMAT));


    private static final String moduleName = "keras.layers.convolutional";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters>optionalParams;

    ConvolutionalLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName(){
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum PoolingLayers implements KerasLayers {

    MaxPooling1D("MaxPooling1D",Arrays.asList(new KerasParameters("pool_size", PythonTypes.NUMBER), new KerasParameters("strides", PythonTypes.NUMBER), KerasParameterConstant.PADDING), EMPTY_LIST),
    MaxPooling2D("MaxPooling2D",Arrays.asList(KerasParameterConstant.POOL_SIZE, KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),
    AveragePooling2D("AveragePooling2D",Arrays.asList(KerasParameterConstant.POOL_SIZE, KerasParameterConstant.STRIDES, KerasParameterConstant.PADDING), Collections.singletonList(KerasParameterConstant.DATA_FORMAT)),
    GlobalAveragePooling2D("GlobalAveragePooling2D", EMPTY_LIST, Collections.singletonList(KerasParameterConstant.DATA_FORMAT));

    private static final String moduleName = "keras.layers.pooling";

    private String className;
    private List<KerasParameters>requiredParams;
    private List<KerasParameters>optionalParams;

    PoolingLayers(String className, List<KerasParameters>requiredParams, List<KerasParameters>optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName(){
        return className;
    }

    @Override
    public List<KerasParameters>getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters>getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum RecurrentLayers implements KerasLayers {
    RNN("RNN", Collections.singletonList(new KerasParameters("cell", PythonTypes.STATEMENTS))
            , Arrays.asList(KerasParameterConstant.RETURN_SEQUENCES, KerasParameterConstant.RETURN_STATE
                    , KerasParameterConstant.GO_BACKWARDS, KerasParameterConstant.STATEFUL, KerasParameterConstant.UNROLL)),
    GRU("GRU"
            , Collections.singletonList(KerasParameterConstant.UNITS)
            , Arrays.asList(KerasParameterConstant.ACTIVATION, KerasParameterConstant.RECURRENT_ACTIVATION, KerasParameterConstant.USE_BIAS
            , KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.RECURRENT_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER
            , KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT, KerasParameterConstant.RECURRENT_CONSTRAINT
            , KerasParameterConstant.BIAS_CONSTRAINT, KerasParameterConstant.DROPOUT, KerasParameterConstant.RECURRENT_DROPOUT
            , KerasParameterConstant.IMPLEMENTATION, KerasParameterConstant.RETURN_SEQUENCES, KerasParameterConstant.RETURN_STATE
            , KerasParameterConstant.GO_BACKWARDS, KerasParameterConstant.STATEFUL, KerasParameterConstant.UNROLL, KerasParameterConstant.RESET_AFTER)),
    LSTM("LSTM"
            , Collections.singletonList(KerasParameterConstant.UNITS)
            , Arrays.asList(KerasParameterConstant.ACTIVATION, KerasParameterConstant.RECURRENT_ACTIVATION, KerasParameterConstant.USE_BIAS
            , KerasParameterConstant.INITIALIZER, KerasParameterConstant.RECURRENT_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER, KerasParameterConstant.UNIT_FORGET_BIAS
            , KerasParameterConstant.KERNEL_REGULARIZER, KerasParameterConstant.RECURRENT_REGULARIZER, KerasParameterConstant.BIAS_REGULARIZER
            , KerasParameterConstant.ACTIVITY_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT, KerasParameterConstant.RECURRENT_CONSTRAINT
            , KerasParameterConstant.BIAS_CONSTRAINT, KerasParameterConstant.DROPOUT, KerasParameterConstant.RECURRENT_DROPOUT
            , KerasParameterConstant.IMPLEMENTATION, KerasParameterConstant.RETURN_SEQUENCES, KerasParameterConstant.RETURN_STATE
            , KerasParameterConstant.GO_BACKWARDS, KerasParameterConstant.STATEFUL, KerasParameterConstant.UNROLL)),
    SimpleRNNCell("SimpleRNNCell"
            , Collections.singletonList(KerasParameterConstant.UNITS)
            , Arrays.asList(KerasParameterConstant.ACTIVATION, KerasParameterConstant.USE_BIAS, KerasParameterConstant.KERNEL_INITIALIZER
                    , KerasParameterConstant.RECURRENT_INITIALIZER, KerasParameterConstant.BIAS_INITIALIZER, KerasParameterConstant.KERNEL_REGULARIZER
                    , KerasParameterConstant.BIAS_REGULARIZER, KerasParameterConstant.KERNEL_CONSTRAINT, KerasParameterConstant.RECURRENT_CONSTRAINT
                    , KerasParameterConstant.BIAS_CONSTRAINT, KerasParameterConstant.DROPOUT, KerasParameterConstant.RECURRENT_DROPOUT)
            );

    private static final String moduleName = "keras.layers.recurrent";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    RecurrentLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum EmbeddingsLayers implements KerasLayers {
    Embedding("Embedding",
            Arrays.asList(KerasParameterConstant.INPUT_DIM, KerasParameterConstant.OUTPUT_DIM,
                    KerasParameterConstant.INPUT_LENGTH),
            Arrays.asList(KerasParameterConstant.EMBEDDINGS_INITIALIZER,
                    KerasParameterConstant.EMBEDDINGS_REGULARIZER, KerasParameterConstant.ACTIVITY_REGULARIZER,
                    KerasParameterConstant.EMBEDDINGS_CONSTRAINT, KerasParameterConstant.MASK_ZERO));

    private static final String moduleName = "keras.layers.embeddings";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    EmbeddingsLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum MergeLayers implements KerasLayers {

    Add("Add", EMPTY_LIST, EMPTY_LIST),
    Concatenate("Concatenate", EMPTY_LIST, Collections.singletonList(KerasParameterConstant.AXIS));

    private static final String moduleName = "keras.layers.merge";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    MergeLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum AdvancedActivationsLayers implements KerasLayers {
    LeakyReLU("LeakyReLU", EMPTY_LIST, Collections.singletonList(KerasParameterConstant.ALPHA)),
    ELU("ELU", EMPTY_LIST, Collections.singletonList(KerasParameterConstant.ALPHA));

    private static final String moduleName = "keras.layers.advanced_activations";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    AdvancedActivationsLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum NormalizationLayers implements KerasLayers {
    BatchNormalization("BatchNormalization",
            Arrays.asList(KerasParameterConstant.AXIS, KerasParameterConstant.MOMENTUM,
                    KerasParameterConstant.EPSILON, KerasParameterConstant.CENTER,
                    KerasParameterConstant.SCALE),
            Arrays.asList(KerasParameterConstant.BETA_INITIALIZER, KerasParameterConstant.GAMMA_INITIALIZER,
                    KerasParameterConstant.MOVING_MEAN_INITIALIZER, KerasParameterConstant.MOVING_VARIANCE_INITIALIZER,
                    KerasParameterConstant.BETA_REGULARIZER, KerasParameterConstant.GAMMA_REGULARIZER,
                    KerasParameterConstant.BETA_CONSTRAINT, KerasParameterConstant.GAMMA_CONSTRAINT));

    private static final String moduleName = "keras.layers";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    NormalizationLayers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum LayerWrappers implements KerasLayers {
    Bidirectional("Bidirectional"
            , Collections.singletonList(new KerasParameters("layer", PythonTypes.STATEMENTS))
            , Arrays.asList(new KerasParameters("merge_mode", PythonTypes.STR), new KerasParameters("weights", PythonTypes.TUPLE))); // XXX What is the type of weights?

    private static final String moduleName = "keras.layers.wrappers";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    LayerWrappers(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum TextPreprocessing implements KerasLayers {
    one_hot("one_hot",
            Arrays.asList(KerasParameterConstant.TEXT, KerasParameterConstant.N),
            Arrays.asList(KerasParameterConstant.FILTERS_STR, KerasParameterConstant.LOWER,
                    KerasParameterConstant.SPLIT));

    private static final String moduleName = "keras.preprocessing.text";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    TextPreprocessing(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }
}

enum Applications implements KerasLayers {
    InceptionV3("InceptionV3", EMPTY_LIST, Arrays.asList(KerasParameterConstant.INCLUDE_TOP, KerasParameterConstant.WEIGHTS, KerasParameterConstant.INPUT_SHAPE)),
    InceptionResNetV2("InceptionResNetV2", EMPTY_LIST, Arrays.asList(KerasParameterConstant.INCLUDE_TOP, KerasParameterConstant.WEIGHTS, KerasParameterConstant.INPUT_SHAPE)),

    VGG16("VGG16", Arrays.asList(KerasParameterConstant.INCLUDE_TOP, KerasParameterConstant.WEIGHTS),
            Arrays.asList(KerasParameterConstant.INPUT_TENSOR, KerasParameterConstant.INPUT_SHAPE, KerasParameterConstant.POOLING, KerasParameterConstant.CLASSES)),
    ResNet50("ResNet50", Arrays.asList(KerasParameterConstant.INCLUDE_TOP, KerasParameterConstant.WEIGHTS),
            Arrays.asList(KerasParameterConstant.INPUT_TENSOR, KerasParameterConstant.INPUT_SHAPE, KerasParameterConstant.POOLING, KerasParameterConstant.CLASSES));

    private static final String moduleName = "keras.applications";

    private String className;
    private List<KerasParameters> requiredParams;
    private List<KerasParameters> optionalParams;

    Applications(String className, List<KerasParameters> requiredParams, List<KerasParameters> optionalParams) {
        this.className = className;
        this.requiredParams = requiredParams;
        this.optionalParams = optionalParams;
    }

    @Override
    public String getModuleName() {
        return moduleName;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public List<KerasParameters> getRequiredParams() {
        return requiredParams;
    }

    @Override
    public List<KerasParameters> getOptionalParams() {
        return optionalParams;
    }

    @Override
    public void validate(JsonObject param) {
        // TODO
    }

    @Override
    public boolean isApplications() {
        return true;
    }
}

