package com.samsung.sds.brightics.common.workflow.model.impl.loop;

import com.google.gson.JsonElement;
import lombok.Data;

@Data
public class LoopStatus {

    int index;
    int count;
    int total;
    JsonElement element;
    String indexVariable;
    String elementVariable;

    public LoopStatus(int index, JsonElement element) {
        this.index = index;
        this.element = element;
    }
}
