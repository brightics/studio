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
import com.samsung.sds.brightics.deeplearning.common.ExecutionType
import com.samsung.sds.brightics.deeplearning.common.toClass
import com.samsung.sds.brightics.deeplearning.model.param.InferenceJobHtml
import com.samsung.sds.brightics.deeplearning.model.param.InferenceJobParam
import com.samsung.sds.brightics.deeplearning.model.param.JobSummaryParam
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Parameter
import java.time.LocalDateTime
import javax.persistence.*

@Entity
class BrtcDlInferenceJob(
        var projectId: String? = "",
        var title: String = "",
        @Column(columnDefinition = "text") var description: String = "",
        var modelId: String,
        @JsonInclude(JsonInclude.Include.NON_EMPTY) @Column(columnDefinition = "text") var content: String,
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String = AuthenticationUtil.getRequestUserId(),
        var updateTime: String = "",
        var executionType: String = ExecutionType.DEFAULT,
        var deleteYn: String? = "N",
        var confType: String? = "",
        @Id @GeneratedValue(generator = "inference_job")
        @GenericGenerator(name = "inference_job"
                , parameters = [Parameter(name = "prefix", value = "ij")]
                , strategy = "com.samsung.sds.brightics.deeplearning.model.entity.generator.CommonPrefixedIdGenerator")
        var id: String = ""
) {

    @OneToOne(cascade = arrayOf(CascadeType.DETACH))
    @JoinColumn(name = "id", referencedColumnName = "id")
    lateinit var summary: BrtcDlInferenceJobSummary

    fun convertToParam(isContainContent: Boolean = true) =
            InferenceJobParam(this.projectId, this.id, this.title, this.description, this.modelId
                    , if (isContainContent) this.content.toClass(Object::class.java) else null, this.creator, this.createTime, this.updater, this.updateTime, this.executionType, this.deleteYn?:"N", this.confType)
}

@Entity
class BrtcDlInferenceJobSummary(
        var projectId: String? = "",
        @Id var id: String,
        var status: String,
        @Column(columnDefinition = "text") var metrics: String,
        var outputPath: String = "",
        var htmlPath: String = "",
        var startTime: String = "",
        var runningId: String = "",
        @Column(columnDefinition = "text") var message: String = "",
        var executionType: String = ExecutionType.DEFAULT,
        var endTime: String = "",
        var updateTime: String = LocalDateTime.now().toString()
) {
    fun convertToParam() = JobSummaryParam(this.status, this.metrics
            , this.startTime, this.runningId, this.message, this.endTime, this.outputPath, htmlPath = this.htmlPath)

    fun convertToParam(inferenceJobHtml: InferenceJobHtml) = JobSummaryParam(this.status, this.metrics
            , this.startTime, this.runningId, this.message, this.endTime, this.outputPath, htmlPath = this.htmlPath, htmlString = inferenceJobHtml.htmlString, validHtml = inferenceJobHtml.validHtml)
}