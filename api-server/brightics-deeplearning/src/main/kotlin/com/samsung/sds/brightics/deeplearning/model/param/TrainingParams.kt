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
import com.samsung.sds.brightics.deeplearning.common.TrainedModeType
import com.samsung.sds.brightics.deeplearning.model.entity.*
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import java.time.LocalDateTime

class TrainingJobParam(
        var projectId: String? = "",
        var id: String = "",
        var title: String = "",
        var description: String = "",
        var type: String = "",
        @JsonInclude(JsonInclude.Include.NON_NULL) var content: Any? = null,
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String? = AuthenticationUtil.getRequestUserId(),
        var updateTime: String? = "",
        var executionType: String = ExecutionType.DEFAULT,
        var deleteYn: String = "N",
        @JsonInclude(JsonInclude.Include.NON_NULL) var status: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) var startTime: String? = null,
        @JsonInclude(JsonInclude.Include.NON_NULL) var endTime: String? = null
) {
    fun convertToEntity(): BrtcDlTrainingJob {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        return BrtcDlTrainingJob(projectId, title, description, type, JsonUtil.toJson(content), creator, currentTime, creator, currentTime, executionType, deleteYn)
    }

    fun convertToSummaryEntity(trainingId: String)
            = BrtcDlTrainingJobSummary(projectId, trainingId, StatusType.READY, "", executionType = executionType, type = type)

    fun convertTrainingJobFrom(trainingJob: BrtcDlTrainingJob): BrtcDlTrainingJob = run {
        trainingJob.projectId = projectId
        trainingJob.title = title
        trainingJob.description = description
        trainingJob.deleteYn = deleteYn
        trainingJob.updater = AuthenticationUtil.getRequestUserId()
        trainingJob.updateTime = LocalDateTime.now().toString()
        trainingJob
    }
}

class TrainedModelParam(
        var projectId: String? = "",
        var id: String = "",
        var title: String = "",
        var description: String = "",
        @JsonInclude(JsonInclude.Include.NON_EMPTY) var type: String = TrainedModeType.DEFAULT,
        var trainingId: String?,
        var modelPath:String = "",
        var metrics: Map<String, Metric>? = null,
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String? = AuthenticationUtil.getRequestUserId(),
        var updateTime: String? = ""
) {
    fun convertToEntity(modelPath:String, jobMetrics: String): BrtcDlTrainedModel {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        return BrtcDlTrainedModel(projectId, title, description, type, trainingId, creator, currentTime, creator, currentTime, modelPath, jobMetrics)
    }

    // import pre-trained model contain model path.
    fun convertToPreTrainedEntity(): BrtcDlTrainedModel {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        return BrtcDlTrainedModel(projectId, title, description, type, "", creator, currentTime, creator, currentTime, modelPath, "")
    }

    fun convertTrainedModelFrom(trainedModel: BrtcDlTrainedModel): BrtcDlTrainedModel = run {
        trainedModel.projectId = projectId
        trainedModel.title = title
        trainedModel.description = description
        trainedModel.updater = AuthenticationUtil.getRequestUserId()
        trainedModel.updateTime = LocalDateTime.now().toString()
        trainedModel
    }
}
