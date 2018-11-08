package com.samsung.sds.brightics.server.common.util.keras.model;

public interface KerasParameterConstant {

    /**
     * Keras have same name but different type parameter.
     * ex) padding: tuple in ZeroPadding2D but str in Conv2D
     */

    KerasParameters NAME = new KerasParameters("name", PythonTypes.STR);

    // STR
    KerasParameters ACTIVATION = new KerasParameters("activation", PythonTypes.STR);
    KerasParameters PADDING = new KerasParameters("padding", PythonTypes.STR);
    KerasParameters DATA_FORMAT = new KerasParameters("data_format", PythonTypes.STR);
    KerasParameters RECURRENT_ACTIVATION = new KerasParameters("recurrent_activation", PythonTypes.STR);
    KerasParameters WEIGHTS = new KerasParameters("weights", PythonTypes.STR);
    KerasParameters OPTIMIZER = new KerasParameters("optimizer", PythonTypes.STR);
    KerasParameters LOSS = new KerasParameters("loss", PythonTypes.STR);
    KerasParameters X = new KerasParameters("x", PythonTypes.STR);
    KerasParameters Y = new KerasParameters("y", PythonTypes.STR);
    KerasParameters DIRECTORY = new KerasParameters("directory", PythonTypes.STR);
    KerasParameters CLASS_MODE = new KerasParameters("class_mode", PythonTypes.STR);
    KerasParameters KERNEL_INITIALIZER = new KerasParameters("kernel_initializer", PythonTypes.STR);
    KerasParameters BIAS_INITIALIZER = new KerasParameters("bias_initializer", PythonTypes.STR);
    KerasParameters KERNEL_REGULARIZER = new KerasParameters("kernel_regularizer", PythonTypes.STR);
    KerasParameters BIAS_REGULARIZER = new KerasParameters("bias_regularizer", PythonTypes.STR);
    KerasParameters ACTIVITY_REGULARIZER = new KerasParameters("activity_regularizer", PythonTypes.STR);
    KerasParameters KERNEL_CONSTRAINT = new KerasParameters("kernel_constraint", PythonTypes.STR);
    KerasParameters BIAS_CONSTRAINT = new KerasParameters("bias_constraint", PythonTypes.STR);
    KerasParameters EMBEDDINGS_INITIALIZER = new KerasParameters("embeddings_initializer", PythonTypes.STR);
    KerasParameters EMBEDDINGS_REGULARIZER = new KerasParameters("embeddings_regularizer", PythonTypes.STR);
    KerasParameters EMBEDDINGS_CONSTRAINT = new KerasParameters("embeddings_constraint", PythonTypes.STR);
    KerasParameters BETA_INITIALIZER = new KerasParameters("beta_initializer", PythonTypes.STR);
    KerasParameters GAMMA_INITIALIZER = new KerasParameters("gamma_initializer", PythonTypes.STR);
    KerasParameters MOVING_MEAN_INITIALIZER = new KerasParameters("moving_mean_initializer", PythonTypes.STR);
    KerasParameters MOVING_VARIANCE_INITIALIZER = new KerasParameters("moving_variance_initializer", PythonTypes.STR);
    KerasParameters BETA_REGULARIZER = new KerasParameters("beta_regularizer", PythonTypes.STR);
    KerasParameters GAMMA_REGULARIZER = new KerasParameters("gamma_regularizer", PythonTypes.STR);
    KerasParameters BETA_CONSTRAINT = new KerasParameters("beta_constraint", PythonTypes.STR);
    KerasParameters GAMMA_CONSTRAINT = new KerasParameters("gamma_constraint", PythonTypes.STR);
    KerasParameters INITIALIZER = new KerasParameters("kernel_initializer", PythonTypes.STR);
    KerasParameters RECURRENT_INITIALIZER = new KerasParameters("recurrent_initializer", PythonTypes.STR);
    KerasParameters RECURRENT_REGULARIZER = new KerasParameters("recurrent_regularizer", PythonTypes.STR);
    KerasParameters RECURRENT_CONSTRAINT = new KerasParameters("recurrent_constraint", PythonTypes.STR);
    KerasParameters TEXT = new KerasParameters("text", PythonTypes.STR);
    KerasParameters FILTERS_STR = new KerasParameters("filters", PythonTypes.STR);
    KerasParameters SPLIT = new KerasParameters("split", PythonTypes.STR);
    KerasParameters INPUT_TENSOR = new KerasParameters("input_tensor", PythonTypes.STR);
    KerasParameters POOLING = new KerasParameters("pooling", PythonTypes.STR);
    KerasParameters DEPTHWISE_INITIALIZER = new KerasParameters("depthwide_initializer", PythonTypes.STR);
    KerasParameters POINTWISE_INITIALIZER = new KerasParameters("pointwise_initializer", PythonTypes.STR);
    KerasParameters DEPTHWISE_REGULARIZER = new KerasParameters("depthwide_regularizer", PythonTypes.STR);
    KerasParameters POINTWISE_REGULARIZER = new KerasParameters("pointwise_regularizer", PythonTypes.STR);
    KerasParameters DEPTHWISE_CONSTRAINT = new KerasParameters("depthwide_constraint", PythonTypes.STR);
    KerasParameters POINTWISE_CONSTRAINT = new KerasParameters("pointwise_constraint", PythonTypes.STR);
    KerasParameters INTERPOLATION = new KerasParameters("interpolation", PythonTypes.STR);


    // BOOL
    KerasParameters RETURN_SEQUENCES = new KerasParameters("return_sequences", PythonTypes.BOOL);
    KerasParameters INCLUDE_TOP = new KerasParameters("include_top", PythonTypes.BOOL);
    KerasParameters SHUFFLE = new KerasParameters("shuffle", PythonTypes.BOOL);
    KerasParameters USE_BIAS = new KerasParameters("use_bias", PythonTypes.BOOL);
    KerasParameters RETURN_STATE = new KerasParameters("return_state", PythonTypes.BOOL);
    KerasParameters GO_BACKWARDS = new KerasParameters("go_backwards", PythonTypes.BOOL);
    KerasParameters STATEFUL = new KerasParameters("stateful", PythonTypes.BOOL);
    KerasParameters UNROLL = new KerasParameters("unroll", PythonTypes.BOOL);
    KerasParameters RESET_AFTER = new KerasParameters("reset_after", PythonTypes.BOOL);
    KerasParameters UNIT_FORGET_BIAS = new KerasParameters("unit_forget_bias", PythonTypes.BOOL);
    KerasParameters CENTER = new KerasParameters("center", PythonTypes.BOOL);
    KerasParameters SCALE = new KerasParameters("scale", PythonTypes.BOOL);
    KerasParameters MASK_ZERO = new KerasParameters("mask_zero", PythonTypes.BOOL);
    KerasParameters LOWER = new KerasParameters("lower", PythonTypes.BOOL);

    // LIST
    KerasParameters METRICS = new KerasParameters("metrics", PythonTypes.LIST);

    // TUPLE
    KerasParameters TARGET_SHAPE = new KerasParameters("target_shape", PythonTypes.TUPLE);
    KerasParameters KERNEL_SIZE = new KerasParameters("kernel_size", PythonTypes.TUPLE);
    KerasParameters POOL_SIZE = new KerasParameters("pool_size", PythonTypes.TUPLE);
    KerasParameters INPUT_SHAPE = new KerasParameters("input_shape", PythonTypes.TUPLE);
    KerasParameters STRIDES = new KerasParameters("strides", PythonTypes.TUPLE);
    KerasParameters TARGET_SIZE = new KerasParameters("target_size", PythonTypes.TUPLE);
    KerasParameters OUTPUT_PADDING = new KerasParameters("output_padding", PythonTypes.TUPLE);
    KerasParameters SIZE = new KerasParameters("size", PythonTypes.TUPLE);
    KerasParameters DILATION_RATE = new KerasParameters("dilation_rate", PythonTypes.TUPLE);
    KerasParameters CROPPING = new KerasParameters("cropping", PythonTypes.TUPLE);

    // NUMBER
    KerasParameters UNITS = new KerasParameters("units", PythonTypes.NUMBER);
    KerasParameters RATE = new KerasParameters("rate", PythonTypes.NUMBER);
    KerasParameters FILTERS = new KerasParameters("filters", PythonTypes.NUMBER);
    KerasParameters DROPOUT = new KerasParameters("dropout", PythonTypes.NUMBER);
    KerasParameters RECURRENT_DROPOUT = new KerasParameters("recurrent_dropout", PythonTypes.NUMBER);
    KerasParameters INPUT_DIM = new KerasParameters("input_dim", PythonTypes.NUMBER);
    KerasParameters OUTPUT_DIM = new KerasParameters("output_dim", PythonTypes.NUMBER);
    KerasParameters INPUT_LENGTH = new KerasParameters("input_length", PythonTypes.NUMBER);
    KerasParameters AXIS = new KerasParameters("axis", PythonTypes.NUMBER);
    KerasParameters ALPHA = new KerasParameters("alpha", PythonTypes.NUMBER);
    KerasParameters BATCH_SIZE = new KerasParameters("batch_size", PythonTypes.NUMBER);
    KerasParameters EPOCHS = new KerasParameters("epochs", PythonTypes.NUMBER);
    KerasParameters STEPS_PER_EPOCH = new KerasParameters("steps_per_epoch", PythonTypes.NUMBER);
    KerasParameters VALIDATION_STEPS = new KerasParameters("validation_steps", PythonTypes.NUMBER);
    KerasParameters SEED = new KerasParameters("seed", PythonTypes.NUMBER);
    KerasParameters IMPLEMENTATION = new KerasParameters("implementation", PythonTypes.NUMBER);
    KerasParameters MOMENTUM = new KerasParameters("momentum", PythonTypes.NUMBER);
    KerasParameters EPSILON = new KerasParameters("epsilon", PythonTypes.NUMBER);
    KerasParameters N = new KerasParameters("n", PythonTypes.NUMBER);
    KerasParameters DEPTH_MULTIPLIER = new KerasParameters("depthwide_multiplier", PythonTypes.NUMBER);
    KerasParameters CLASSES = new KerasParameters("classes", PythonTypes.NUMBER);


    // FRACTION
}
