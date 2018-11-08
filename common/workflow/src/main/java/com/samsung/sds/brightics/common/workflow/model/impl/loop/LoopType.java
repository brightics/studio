package com.samsung.sds.brightics.common.workflow.model.impl.loop;

public enum LoopType {
    COUNT("count"), COLLECTION("collection");

    private String type;

    LoopType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static LoopType getLoopType(String type) {
        if ("count".equals(type)) {
            return LoopType.COUNT;
        } else if ("collection".equals(type)) {
            return LoopType.COLLECTION;
        }
        return null;
    }
}
