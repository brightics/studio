package com.samsung.sds.brightics.common.data.view;

import java.util.List;

public class ObjectTable extends Table {

    private static final long serialVersionUID = -2906483099069377585L;

    public ObjectTable(long count, long bytes, Column[] schema, Object[][] data) {
        super(count, bytes, schema);
        this.data.put("data", data);
    }
    
    public ObjectTable(long count, long bytes, Column[] schema, List<Object[]> data) {
        super(count, bytes, schema);
        this.data.put("data", data);
    }

}
