package com.samsung.sds.brightics.common.data.view;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonTable extends Table {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final long serialVersionUID = -2975422520717348573L;

    public JsonTable(long count, long bytes, Column[] schema, String jsonString) {
        super(count, bytes, schema);
        try {
            this.data.put("data", mapper.readValue(jsonString, Object.class));
        } catch (IOException e) {
            throw new IllegalArgumentException("invalid json data", e);
        }
    }
}
