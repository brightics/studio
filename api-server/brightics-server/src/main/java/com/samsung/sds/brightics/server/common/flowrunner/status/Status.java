/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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
