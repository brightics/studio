package com.samsung.sds.brightics.common.workflow.runner.status;

public enum Status {
    WAITING("WAIT"),
    PROCESSING("PROCESSING"),
    SUCCESS("SUCCESS"),
    FAIL("FAIL");

    String status;

    Status(String status) {
        this.status = status;
    }

    public String toString() {
        return this.status;
    }
}
