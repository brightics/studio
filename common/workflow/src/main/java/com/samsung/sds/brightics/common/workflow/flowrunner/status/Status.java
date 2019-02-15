package com.samsung.sds.brightics.common.workflow.flowrunner.status;

public enum Status {
    WAITING("WAIT"),
    PROCESSING("PROCESSING"),
    SUCCESS("SUCCESS"),
    FAIL("FAIL");

    String jobStatus;

    Status(String status) {
        this.jobStatus = status;
    }

    public String toString() {
        return this.jobStatus;
    }
}
