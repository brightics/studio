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

package com.samsung.sds.brightics.deeplearning.service

import com.samsung.sds.brightics.deeplearning.common.BrighticsDLRestTemplate
import com.samsung.sds.brightics.deeplearning.common.StatusType
import com.samsung.sds.brightics.deeplearning.common.filterWithSessionUser
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlInferenceJobSummary
import com.samsung.sds.brightics.deeplearning.model.entity.repository.*
import com.samsung.sds.brightics.deeplearning.model.param.InferenceJobParam
import com.samsung.sds.brightics.deeplearning.model.param.JobSummaryParam
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class InferenceJobService(private var inferenceJobRepository: InferenceJobRepository
                          , private var inferenceJobSummaryRepository: InferenceJobSummaryRepository
                          , private val restTemplate: BrighticsDLRestTemplate) {

    fun inferenceJobList(projectId: String?): List<InferenceJobParam> {
        val inferenceJobList =
                (projectId?.let { inferenceJobRepository.findAllByProjectIdAndDeleteYnOrderByCreateTimeDesc(projectId, "N") }
                        ?: inferenceJobRepository.findAllByDeleteYnOrderByCreateTimeDesc("N")).map { inferenceJob ->
                    val inferenceJobParam = inferenceJob.convertToParam(false)
                    val summary = inferenceJob.summary
                    val statusUpdateCondition = !StatusType.isFinishStatusType(summary.status)
                    val updatedSummary = updateSummaryToCurrentStatus(summary, statusUpdateCondition)
                    inferenceJobParam.status = updatedSummary.status
                    inferenceJobParam.startTime = updatedSummary.startTime
                    inferenceJobParam.endTime = updatedSummary.endTime
                    inferenceJobParam
                }
        return inferenceJobList
                .filterWithSessionUser() as List<InferenceJobParam>
    }

    fun getInferenceJob(id: String) = inferenceJobRepository.findOne(id).convertToParam()

    fun getInferenceJobSummary(id: String): JobSummaryParam {
        val summary = inferenceJobSummaryRepository.findOne(id)
        val statusUpdateCondition = !StatusType.isFinishStatusType(summary.status)
        val updatedSummary = updateSummaryToCurrentStatus(summary, statusUpdateCondition)
        if(updatedSummary.status == StatusType.COMPLETED && !updatedSummary.htmlPath.isNullOrEmpty()) {
            val jobHtml = restTemplate.getInferenceJobHtml(updatedSummary.htmlPath, updatedSummary.executionType)
            return updatedSummary.convertToParam(jobHtml)
        }
        else {
            return updatedSummary.convertToParam()
        }
    }

    fun getInferenceJobLog(id: String): Map<String, String> {
        val summary = inferenceJobSummaryRepository.findOne(id)
        return mapOf("status" to summary.status,
                "message" to restTemplate.getInferenceJobLog(summary.runningId, summary.executionType))
    }

    @Transactional
    fun saveInferenceJob(inferenceJob: InferenceJobParam): String? {
        //initialize Inference job.
        val inferenceJobId = inferenceJobRepository.save(inferenceJob.convertToEntity(), "Inference job").id

        //initialize Inference job summary.
        inferenceJobSummaryRepository.save(inferenceJob.convertToSummaryEntity(inferenceJobId), "Inference job Summary")

        try {
            //execute training job
            val result = restTemplate.executeInferenceJob(inferenceJob.content!!, inferenceJob.executionType)

            //update summary to Running
            updateSummaryToRunningStatus(inferenceJobId, result)
        } catch (e: Exception) {
            //update summary to Failed
            updateSummaryToFailedStatus(inferenceJobId, ExceptionUtils.getStackTrace(e))
        }
        return inferenceJobId
    }

    fun updateInferenceJobBasicInfo(inferenceJobId: String, inferenceJobParam: InferenceJobParam) {
        val inferenceJob = inferenceJobRepository.findOne(inferenceJobId)
        inferenceJobRepository.update(inferenceJobParam.convertInferenceJobFrom(inferenceJob), "Inference job")
    }

    fun updateDeleteYn(inferenceIds: String, deleteYn: String) {
        val inferenceIdList = inferenceIds.split(",")
        inferenceJobRepository.updateDeleteYnByIdList(inferenceIdList, deleteYn)
    }

    fun stopInferenceJob(inferenceJobId: String) {
        val summary = inferenceJobSummaryRepository.findOne(inferenceJobId)
        restTemplate.stopInferenceJob(summary.runningId, summary.executionType)
    }

    fun inferenceJobCount(projectId: String?): Map<String, Int> {
        val inferenceJobList = inferenceJobList(projectId)
        return mutableMapOf(
                "running" to inferenceJobList.filter { it.status == StatusType.RUNNING }.size,
                "completed" to inferenceJobList.filter { it.status == StatusType.COMPLETED }.size
        )
    }

    private fun updateSummaryToRunningStatus(inferenceJobId: String, result: BrighticsDLRestTemplate.ExecuteJobResult) {
        val summary = inferenceJobSummaryRepository.findOne(inferenceJobId)
        summary.status = StatusType.WAIT
        summary.runningId = result.experiment_name
        summary.outputPath = result.output_path
        summary.htmlPath = result.html_path
        inferenceJobSummaryRepository.update(summary, "Inference job summary")
    }

    private fun updateSummaryToFailedStatus(inferenceJobId: String, message: String) {
        val summary = inferenceJobSummaryRepository.findOne(inferenceJobId)
        summary.status = StatusType.FAILED
        summary.message = message
        inferenceJobSummaryRepository.update(summary, "Inference job summary")
    }

    private fun updateSummaryToCurrentStatus(summary: BrtcDlInferenceJobSummary, statusUpdateCondition: Boolean = true): BrtcDlInferenceJobSummary {
        if (statusUpdateCondition) {
            val jobStatusParam = restTemplate.getInferenceJobStatus(summary.runningId, summary.executionType)
            summary.status = jobStatusParam.status
            if (StatusType.UNIDENTIFIED != jobStatusParam.status) {
                summary.startTime = jobStatusParam.startTime
                summary.endTime = jobStatusParam.endTime
            }
            if (StatusType.FAILED == jobStatusParam.status) {
                summary.message = restTemplate.getInferenceJobText(summary.runningId, summary.executionType)
            }
            summary.updateTime = LocalDateTime.now().toString()
            inferenceJobSummaryRepository.update(summary, "Inference job summary")
        }
        return summary;
    }
}