package com.samsung.sds.brightics.server.common.util.keras.model;

import lombok.Data;
import lombok.NonNull;

@Data
public class KerasParameters {
    @NonNull String name;
    @NonNull PythonTypes type;
}
