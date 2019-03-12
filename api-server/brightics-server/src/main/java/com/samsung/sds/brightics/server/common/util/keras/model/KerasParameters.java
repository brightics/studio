package com.samsung.sds.brightics.server.common.util.keras.model;

import lombok.Data;
import lombok.NonNull;

import java.io.Serializable;

@Data
public class KerasParameters implements Serializable {
    @NonNull String name;
    @NonNull PythonTypes type;
}
