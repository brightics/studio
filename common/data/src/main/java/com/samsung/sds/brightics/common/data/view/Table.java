package com.samsung.sds.brightics.common.data.view;


import java.util.HashMap;
import java.util.Map;

public class Table extends DataView<Map<String,Object>> {

    private static final long serialVersionUID = -7308686935509191570L;

    public Table(long count, long bytes, Column[] schema) {
        super("table", new HashMap<String, Object>());
        this.data.put("count", count);
        this.data.put("bytes", bytes);
        this.data.put("schema", schema);
    }
}
