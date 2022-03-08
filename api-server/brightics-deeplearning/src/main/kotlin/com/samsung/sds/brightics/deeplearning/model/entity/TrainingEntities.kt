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

package com.samsung.sds.brightics.deeplearning.model.entity

import com.fasterxml.jackson.annotation.JsonInclude
import com.google.gson.reflect.TypeToken
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder
import com.samsung.sds.brightics.deeplearning.common.*
import com.samsung.sds.brightics.deeplearning.model.param.*
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Parameter
import java.time.LocalDateTime
import javax.persistence.*

@Entity
class BrtcDlTrainingJob(
        var projectId: String? = "",
        var title: String,
        @Column(columnDefinition = "text") var description: String = "",
        var type: String = TrainingJobType.DEFAULT,
        @JsonInclude(JsonInclude.Include.NON_EMPTY) @Column(columnDefinition = "text") var content: String = "",
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String = AuthenticationUtil.getRequestUserId(),
        var updateTime: String = "",
        var executionType: String = ExecutionType.DEFAULT,
        var deleteYn: String? = "N",
        @Id @GeneratedValue(generator = "training_job")
        @GenericGenerator(name = "training_job"
                , parameters = [Parameter(name = "prefix", value = "tj")]
                , strategy = "com.samsung.sds.brightics.deeplearning.model.entity.generator.CommonPrefixedIdGenerator")
        var id: String = ""
) {

    @OneToOne(cascade = arrayOf(CascadeType.DETACH))
    @JoinColumn(name = "id", referencedColumnName = "id")
    lateinit var summary: BrtcDlTrainingJobSummary

    fun convertToParam(isContainContent: Boolean = true) =
            TrainingJobParam(this.projectId, this.id, this.title, this.description, this.type
                    , if (isContainContent) this.content.toClass(Object::class.java) else null, this.creator, this.createTime, this.updater, this.updateTime, this.executionType, this.deleteYn?:"N")
}

@Entity
class BrtcDlTrainingJobSummary(
        var projectId: String? = "",
        @Id var id: String,
        var status: String,
        @Column(columnDefinition = "text") var metrics: String,
        var outputPath: String = "",
        var startTime: String = "",
        var runningId: String = "",
        @Column(columnDefinition = "text") var message: String = "",
        var executionType: String = ExecutionType.DEFAULT,
        var endTime: String = "",
        var updateTime: String = LocalDateTime.now().toString(),
        var type: String = TrainingJobType.DEFAULT
) {
    fun convertToParam() = JobSummaryParam(this.status, this.metrics
            , this.startTime, this.runningId, this.message, this.endTime, this.outputPath, type = this.type)
}


@Entity
class BrtcDlTrainedModel(
        var projectId: String? = "",
        var title: String,
        @Column(columnDefinition = "text") var description: String = "",
        var type: String = TrainedModeType.DEFAULT,
        var trainingId: String?,
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String = AuthenticationUtil.getRequestUserId(),
        var updateTime: String = "",
        var modelPath: String = "",
        @Column(columnDefinition = "text") var metrics: String,
        @Id @GeneratedValue(generator = "trained_model")
        @GenericGenerator(name = "trained_model"
                , parameters = [Parameter(name = "prefix", value = "tm")]
                , strategy = "com.samsung.sds.brightics.deeplearning.model.entity.generator.CommonPrefixedIdGenerator")
        var id: String = ""
) {
    fun convertToParam() = TrainedModelParam(projectId, id, title, description, type, trainingId
            , modelPath, BrighticsGsonBuilder.getGsonInstance().fromJson(metrics, object : TypeToken<Map<String, Metric>>() {}.type ), creator, createTime, updater, updateTime)
}





