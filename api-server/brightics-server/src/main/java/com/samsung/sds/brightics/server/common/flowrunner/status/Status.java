package com.samsung.sds.brightics.server.common.flowrunner.status;

import static com.samsung.sds.brightics.server.service.repository.JobRepository.STATE_FAIL;
import static com.samsung.sds.brightics.server.service.repository.JobRepository.STATE_PROCESSING;
import static com.samsung.sds.brightics.server.service.repository.JobRepository.STATE_SUCCESS;
import static com.samsung.sds.brightics.server.service.repository.JobRepository.STATE_WAITING;

public enum Status {
    WAITING(STATE_WAITING),
    PROCESSING(STATE_PROCESSING),
    SUCCESS(STATE_SUCCESS),
    FAIL(STATE_FAIL);

    String status;

    Status(String status) {
        this.status = status;
    }

    public String toString() {
        return this.status;
    }
}
