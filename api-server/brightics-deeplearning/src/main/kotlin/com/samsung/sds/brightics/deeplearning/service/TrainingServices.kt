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

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException
import com.samsung.sds.brightics.common.core.util.JsonUtil
import com.samsung.sds.brightics.deeplearning.common.*
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlTrainingJobSummary
import com.samsung.sds.brightics.deeplearning.model.entity.repository.TrainedModelRepository
import com.samsung.sds.brightics.deeplearning.model.entity.repository.TrainingJobRepository
import com.samsung.sds.brightics.deeplearning.model.entity.repository.TrainingJobSummaryRepository
import com.samsung.sds.brightics.deeplearning.model.param.JobSummaryParam
import com.samsung.sds.brightics.deeplearning.model.param.Metric
import com.samsung.sds.brightics.deeplearning.model.param.TrainedModelParam
import com.samsung.sds.brightics.deeplearning.model.param.TrainingJobParam
import com.samsung.sds.brightics.server.common.http.BrighticsCommonRestTemplate
import org.apache.commons.lang3.exception.ExceptionUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.BufferedReader
import java.net.HttpURLConnection
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime
import javax.servlet.http.HttpServletResponse


@Service
class TrainingJobService(private var trainingJobRepository: TrainingJobRepository
                         , private var trainingJobSummaryRepository: TrainingJobSummaryRepository
                         , private val restTemplate: BrighticsDLRestTemplate) {

    fun trainingJobList(projectId: String?): List<TrainingJobParam> {
        val trainingJobList =
                (projectId?.let { trainingJobRepository.findAllByProjectIdAndDeleteYnOrderByCreateTimeDesc(projectId, "N") }
                        ?: trainingJobRepository.findAllByDeleteYnOrderByCreateTimeDesc("N")).map { trainingJob ->
                    val trainingJobParam = trainingJob.convertToParam(false)
                    val summary = trainingJob.summary
                    val statusUpdateCondition = !StatusType.isFinishStatusType(summary.status)
                    val updatedSummary = updateSummaryToCurrentStatusAndMetric(summary, statusUpdateCondition, false)
                    trainingJobParam.status = updatedSummary.status
                    trainingJobParam.startTime = updatedSummary.startTime
                    trainingJobParam.endTime = updatedSummary.endTime
                    trainingJobParam
                }
        return trainingJobList
                .filterWithSessionUser() as List<TrainingJobParam>
    }

    fun getTrainingJob(id: String) = trainingJobRepository.findOne(id).convertToParam()

    fun getTrainingJobSummary(id: String): JobSummaryParam {
        val summary = trainingJobSummaryRepository.findOne(id)
        val statusUpdateCondition = !StatusType.isFinishStatusType(summary.status)
        val updatedSummary = updateSummaryToCurrentStatusAndMetric(summary, statusUpdateCondition)
        return updatedSummary.convertToParam()
    }

    fun getTrainingJobLog(id: String): Map<String, String> {
        val summary = trainingJobSummaryRepository.findOne(id)
        val message = restTemplate.getTrainingJobLog(summary.runningId, summary.executionType)
        return mapOf("status" to summary.status,
                "message" to message)
    }

    @Transactional
    fun saveTrainingJob(trainingJob: TrainingJobParam): String? {
        //initialize training job.
        val trainingId = trainingJobRepository.save(trainingJob.convertToEntity(), "Training job").id

        //initialize training job summary
        trainingJobSummaryRepository.save(trainingJob.convertToSummaryEntity(trainingId), "Training job summary")

        try {
            val result =  restTemplate.executeTrainingJob(trainingJob.content!!, trainingJob.executionType)
            //update summary to Running
            updateSummaryToRunningStatus(trainingId, result)
        } catch (e: Exception) {
            //update summary to Failed
            updateSummaryToFailedStatus(trainingId, ExceptionUtils.getStackTrace(e))
        }

        return trainingId
    }

    fun updateTrainingJobBasicInfo(trainingId: String, trainingJobParam: TrainingJobParam) {
        val trainingJob = trainingJobRepository.findOne(trainingId)
        trainingJobRepository.update(trainingJobParam.convertTrainingJobFrom(trainingJob), "Training job")
    }

    fun updateDeleteYn(trainingIds: String, deleteYn: String) {
        val trainingIdList = trainingIds.split(",")
        trainingJobRepository.updateDeleteYnByIdList(trainingIdList, deleteYn)
    }

    fun stopTrainingJob(trainingId: String) {
        val summary = trainingJobSummaryRepository.findOne(trainingId)
        restTemplate.stopTrainingJob(summary.runningId, summary.executionType)
    }

    fun trainingJobCount(projectId: String?): Map<String, Int> {
        val trainingJobList = trainingJobList(projectId)
        return mutableMapOf(
                "running" to trainingJobList.filter { it.status == StatusType.RUNNING }.size,
                "completed" to trainingJobList.filter { it.status == StatusType.COMPLETED }.size
        )
    }

    private fun updateSummaryToRunningStatus(trainingId: String, result: BrighticsDLRestTemplate.ExecuteJobResult) {
        val summary = trainingJobSummaryRepository.findOne(trainingId)
        summary.status = StatusType.WAIT
        summary.runningId = result.experiment_name
        summary.outputPath = result.output_path
        trainingJobSummaryRepository.update(summary, "Training job summary")
    }

    private fun updateSummaryToFailedStatus(trainingId: String, message: String) {
        val summary = trainingJobSummaryRepository.findOne(trainingId)
        summary.status = StatusType.FAILED
        summary.message = message
        trainingJobSummaryRepository.update(summary, "Training job summary")
    }

    private fun updateSummaryToCurrentStatusAndMetric(summary: BrtcDlTrainingJobSummary, statusUpdateCondition: Boolean = true, metricUpdateCondition: Boolean = true): BrtcDlTrainingJobSummary {
        if (statusUpdateCondition) {
            val jobStatusParam = restTemplate.getTrainingJobStatus(summary.runningId, summary.executionType)
            summary.status = jobStatusParam.status
            if (StatusType.UNIDENTIFIED != jobStatusParam.status) {
                summary.startTime = jobStatusParam.startTime
                summary.endTime = jobStatusParam.endTime
            }
            if (StatusType.FAILED == jobStatusParam.status) {
                summary.message = restTemplate.getTrainingJobText(summary.runningId, summary.executionType)
            }
        }
        if (metricUpdateCondition) {
            summary.metrics = restTemplate.getTrainingJobMetrics(summary.outputPath, summary.executionType).toString()
        }
        if(statusUpdateCondition || metricUpdateCondition) {
            summary.updateTime = LocalDateTime.now().toString()
            trainingJobSummaryRepository.update(summary, "Training job summary")
        }
        return summary;
    }

    fun getTensorboardUrl(outputPath: String): String {
        return restTemplate.getTensorboardUrl(outputPath)
    }
}

@Service
class TrainedModelService(private var trainingJobService: TrainingJobService
                          , private var trainedModelRepository: TrainedModelRepository
                          , private var brighticsCommonRestTemplate: BrighticsCommonRestTemplate) {

    private val logger = LoggerFactory.getLogger(TrainedModelService::class.java)

    fun trainedModelList(projectId: String?, type: String?): List<TrainedModelParam> {
        val trainedModelList =
                (projectId?.let { projectId ->
                    type?.let { type ->
                        trainedModelRepository.findAllByProjectIdAndTypeOrderByCreateTimeDesc(projectId, type)
                    } ?: trainedModelRepository.findAllByProjectIdOrderByCreateTimeDesc(projectId)
                } ?: type?.let {
                    trainedModelRepository.findAllByTypeOrderByCreateTimeDesc(it)
                } ?: trainedModelRepository.findAllByOrderByCreateTimeDesc()).map { it.convertToParam() }
        return trainedModelList
                .filterWithSessionUser() as List<TrainedModelParam>
    }

    fun getTrainedModelDetail(id: String): TrainedModelParam = trainedModelRepository.findOne(id).convertToParam()

    @Transactional
    fun saveTrainedModel(trainedModel: TrainedModelParam): String {
        return when (trainedModel.type) {
            TrainedModeType.PRE_TRAINED -> {
                trainedModelRepository.save(trainedModel.convertToPreTrainedEntity(), "Pre-trained model").id
            }
            else -> {
                val summary = trainingJobService.getTrainingJobSummary(trainedModel.trainingId!!)
                val metrics = if (summary.metrics != null && summary.type == TrainingJobType.DEFAULT) {
                    summary.metrics!!.map { metric ->
                        val keys = metric.value.keys
                        val data = metric.value.data.asReversed().reduceRight { last, second ->
                            if (last.size == keys.size) {
                                return@reduceRight last
                            } else {
                                last.putAll(second.filter { !last.containsKey(it.key) })
                                last
                            }
                        }
                        metric.key to Metric(keys, listOf(data))
                    }.toMap()
                } else {
                    mapOf()
                }
                val modelPath = summary.outputPath!!
                trainedModelRepository.save(trainedModel.convertToEntity(modelPath, JsonUtil.toJson(metrics)), "Trained model").id
            }
        }
    }

    fun trainedModelCount(projectId: String?) = mutableMapOf(
            "default" to trainedModelList(projectId, TrainedModeType.DEFAULT).size,
            "pre-trained" to trainedModelList(projectId, TrainedModeType.PRE_TRAINED).size
    )

    fun downloadModel(modelId: String, check: String, response: HttpServletResponse) {
        try {
            val targetModel = trainedModelRepository.findOne(modelId)
            val url = brighticsCommonRestTemplate.getFullUrl("/api/core/v2/data/download/model", null, mapOf("path" to URLEncoder.encode(targetModel.modelPath, StandardCharsets.UTF_8.toString()), "check" to check)).toURL()
            val con = url.openConnection() as HttpURLConnection
            con.setRequestMethod("GET")
            val responseCode = con.responseCode
            if (responseCode > 299) {
                val content = con.errorStream.bufferedReader().use(BufferedReader::readText)
                response.contentType = "application/json"
                response.characterEncoding = "UTF-8"
                response.status = 500
                response.writer.use { w -> w.print(content) }
            } else {
                val streamReader = BufferedInputStream(con.inputStream)
                if (check == "true") {
                    response.status = 200
                    response.contentType = "application/json"
                    response.characterEncoding = "UTF-8"
                    val content = streamReader.bufferedReader().use(BufferedReader::readText)
                    response.writer.use { w -> w.print(content) }
                } else {
                    val encodeFileName = URLEncoder.encode("$modelId.zip", "UTF-8")
                    response.contentType = "application/octet-stream"
                    response.characterEncoding = "UTF-8"
                    response.setHeader("Content-Disposition", "attachment; filename=$encodeFileName")
                    val outputStream = BufferedOutputStream(response.outputStream)
                    outputStream.use { out ->
                        streamReader.use { reader ->
                            val buf = ByteArray(65535)
                            var total: Long = 0
                            while (true) {
                                val r = reader.read(buf)
                                if (r == -1) {
                                    break
                                }
                                out.write(buf, 0, r)
                                out.flush()
                                total += r.toLong()
                            }
                            logger.info("$total bytes transferred.")
                        }
                    }
                }
            }
        } catch (e: Exception) {
            throw BrighticsCoreException("3402", e.message).addDetailMessage(ExceptionUtils.getStackTrace(e))
        }

    }

    fun updateTrainedModelBasicInfo(modelId: String, trainedModelParam: TrainedModelParam) {
        val trainedModel = trainedModelRepository.findOne(modelId)
        trainedModelRepository.update(trainedModelParam.convertTrainedModelFrom(trainedModel), "Training job")
    }

    fun deleteTrainedModel(modelId: String) = trainedModelRepository.delete(modelId, "Trained model")

}