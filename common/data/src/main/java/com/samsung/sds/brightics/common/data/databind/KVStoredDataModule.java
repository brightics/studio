package com.samsung.sds.brightics.common.data.databind;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class KVStoredDataModule extends SimpleModule {
    private static final String NAME = "dataView module";

    public KVStoredDataModule() {
        super(NAME, Version.unknownVersion());
        addDeserializer(Object.class, new KVStoredDataDeserializer());
    }
}
