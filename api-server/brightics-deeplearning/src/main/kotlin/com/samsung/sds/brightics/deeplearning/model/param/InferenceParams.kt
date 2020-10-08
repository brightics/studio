/*
    Copyright 2020 Samsung SDS

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

package com.samsung.sds.brightics.deeplearning.model.param

import com.fasterxml.jackson.annotation.JsonInclude
import com.samsung.sds.brightics.common.core.util.JsonUtil
import com.samsung.sds.brightics.deeplearning.common.ExecutionType
import com.samsung.sds.brightics.deeplearning.common.StatusType
import com.samsung.sds.brightics.deeplearning.model.entity.*
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import java.time.LocalDateTime

class InferenceJobParam(
        var projectId: String? = "",
        var id: String = "",
        var title: String = "",
        var description: String = "",
        var modelId: String = "",
        @JsonInclude(JsonInclude.Include.NON_NULL) var content: Any? = null,
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String? = AuthenticationUtil.getRequestUserId(),
        var updateTime: String? = "",
        var executionType: String = ExecutionType.DEFAULT,
        var deleteYn: String = "N",
        @JsonInclude(JsonInclude.Include.NON_NULL) var confType: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) var status: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) var startTime: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) var endTime: String? = null
) {
    fun convertToEntity(): BrtcDlInferenceJob {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        return BrtcDlInferenceJob(projectId, title, description, modelId, JsonUtil.toJson(content), creator, currentTime, creator, currentTime, executionType, deleteYn, confType)
    }

    fun convertToSummaryEntity(inferenceJobId: String)
            = BrtcDlInferenceJobSummary(projectId, inferenceJobId, StatusType.READY, "", executionType= executionType)

    fun convertInferenceJobFrom(inferenceJob: BrtcDlInferenceJob): BrtcDlInferenceJob = run {
        inferenceJob.projectId = projectId
        inferenceJob.title = title
        inferenceJob.description = description
        inferenceJob.deleteYn = deleteYn
        inferenceJob.updater = AuthenticationUtil.getRequestUserId()
        inferenceJob.updateTime = LocalDateTime.now().toString()
        inferenceJob
    }
}

class InferenceJobHtml(
        @JsonInclude(JsonInclude.Include.NON_NULL) val htmlString: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) val validHtml: Boolean = true
)