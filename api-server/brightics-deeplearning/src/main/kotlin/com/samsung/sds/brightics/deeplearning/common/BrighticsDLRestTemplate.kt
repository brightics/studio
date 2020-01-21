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

package com.samsung.sds.brightics.deeplearning.common

import com.fasterxml.jackson.annotation.JsonInclude
import com.google.gson.JsonObject
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException
import com.samsung.sds.brightics.common.core.util.IdGenerator
import com.samsung.sds.brightics.common.core.util.JsonUtil
import com.samsung.sds.brightics.deeplearning.model.param.*
import com.samsung.sds.brightics.server.common.http.BrighticsCommonRestTemplate
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import org.apache.commons.lang3.exception.ExceptionUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class BrighticsDLRestTemplate(private var brighticsCommonRestTemplate: BrighticsCommonRestTemplate) {

    private val logger = LoggerFactory.getLogger(BrighticsDLRestTemplate::class.java)
    private val executeTaskUrl = "/api/core/v3/task/execute/{type}"

    private class RequestBodyBase(val action_type: String, val execution_type: String,
                                  @JsonInclude(JsonInclude.Include.NON_NULL) var content: Any? = null,
                                  @JsonInclude(JsonInclude.Include.NON_NULL) var jobId: String? = null,
                                  @JsonInclude(JsonInclude.Include.NON_NULL) var htmlPath: String? = null,
                                  @JsonInclude(JsonInclude.Include.NON_NULL) var outputPath: String? = null)

    class ExecuteJobResult(var experiment_name: String = "", var output_path: String = "", var html_path: String = "")

    private fun dlCommonPost(body: RequestBodyBase, user: String = AuthenticationUtil.getRequestUserId()): JsonObject? {
        val jsonBody = JsonUtil.toJsonObject(body)
        logger.info("Send request to common server. request body : {}", jsonBody)
        val responseBody = brighticsCommonRestTemplate.post(executeTaskUrl, mapOf("type" to "dl-script"), mapOf("name" to "DLPythonScript")
                , jsonBody, user)
        if (responseBody.containsKey("status") && responseBody["status"] == "SUCCESS") {
            if (responseBody.containsKey("result")) {
                val resultString = responseBody["result"].toString()
                logger.debug("result : {}", resultString)
                return JsonUtil.jsonToObject(resultString)
            } else {
                logger.error("Cannot get response body from brightics common server. response {}", responseBody)
                throw BrighticsCoreException("3002", " brightics common server response body result")
            }
        } else {
            if (responseBody.containsKey("message")) {
                val message = responseBody["message"].toString()
                logger.error("Fail to execute task. response {}", responseBody)
                throw BrighticsCoreException("3102", message).addDetailMessage(responseBody.containsKey("detailedCause").toString())
            } else {
                logger.error("Cannot get response body from brightics common server. response {}", responseBody)
                throw BrighticsCoreException("3002", " brightics common server response body result")
            }
        }
    }

    fun createScriptRunner(runningId: String, content: Any, user: String = AuthenticationUtil.getRequestUserId())
            = absCreateInstantJob(runningId, ExecuteActionType.SCRIPT_RUNNER_CREATE, ExecutionType.DEFAULT, content, user)
    fun createPreview(content: Any, user: String = AuthenticationUtil.getRequestUserId())
            = absCreateInstantJob("pj_" + IdGenerator.getSimpleId(), ExecuteActionType.PREVIEW_CREATE, ExecutionType.DEFAULT, content, user)

    fun executeTrainingJob(content: Any, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = absExecuteJob(ExecuteActionType.JOB_EXECUTE_TRAINING, executionType, user, ExecuteJobResult::class.java, content = content)
    fun executeInferenceJob(content: Any, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = absExecuteJob(ExecuteActionType.JOB_EXECUTE_INFERENCE, executionType, user, ExecuteJobResult::class.java, content = content)
    fun executeScriptRunnerResult(runningId: String, user: String = AuthenticationUtil.getRequestUserId())
            = absExecuteJob(ExecuteActionType.SCRIPT_RUNNER_RESULT, ExecutionType.DEFAULT, user, ScriptResult::class.java, runningId = runningId)
    fun executePreview(runningId: String, content: Any, user: String = AuthenticationUtil.getRequestUserId())
            = absExecuteJob(ExecuteActionType.PREVIEW_NEXT, ExecutionType.DEFAULT, user, PreviewResult::class.java, runningId = runningId, content = content)

    fun getTrainingJobStatus(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobStatus(runningId, ExecuteActionType.JOB_STATUS_TRAINING, executionType, user)
    fun getInferenceJobStatus(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobStatus(runningId, ExecuteActionType.JOB_STATUS_INFERENCE, executionType, user)

    fun getTrainingJobText(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobText(runningId, ExecuteActionType.JOB_TEXT_TRAINING, executionType, user)
    fun getInferenceJobText(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobText(runningId, ExecuteActionType.JOB_TEXT_INFERENCE, executionType, user)

    fun getTrainingJobLog(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobText(runningId, ExecuteActionType.JOB_LOG_TRAINING, executionType, user)
    fun getInferenceJobLog(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobText(runningId, ExecuteActionType.JOB_LOG_INFERENCE, executionType, user)

    fun getTrainingJobMetrics(outputPath: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobStatusMetrics(outputPath, ExecuteActionType.JOB_METRICS_TRAINING, executionType, user)

    fun getInferenceJobHtml(htmlPath: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = getJobHtml(htmlPath, ExecuteActionType.JOB_HTML_INFERENCE, executionType, user)

    fun getTensorboardUrl(outputPath: String, user: String = AuthenticationUtil.getRequestUserId())
            = getTensorboardUrl(outputPath, ExecuteActionType.JOB_TENSORBOARD_URL, ExecutionType.DEFAULT, user)

    fun stopTrainingJob(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = stopJob(runningId, ExecuteActionType.JOB_STOP_TRAINING, executionType, user)
    fun stopInferenceJob(runningId: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId())
            = stopJob(runningId, ExecuteActionType.JOB_STOP_INFERENCE, executionType, user)

    fun deleteScriptRunner(runningId: String, user: String = AuthenticationUtil.getRequestUserId())
            = stopJob(runningId, ExecuteActionType.SCRIPT_RUNNER_DELETE, ExecutionType.DEFAULT, user)
    fun deletePreview(runningId: String, user: String = AuthenticationUtil.getRequestUserId())
            = stopJob(runningId, ExecuteActionType.PREVIEW_DELETE, ExecutionType.DEFAULT, user)

    private fun absCreateInstantJob(runningId: String, actionType: String, executionType: String, content: Any, user: String = AuthenticationUtil.getRequestUserId()): String {
        try {
            dlCommonPost(RequestBodyBase(actionType, executionType, content = content, jobId = runningId), user)
            return runningId
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            throw e
        }
    }

    private fun <T> absExecuteJob(actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId(), classOfT: Class<T>, runningId: String? = null, content: Any? = null): T {
        try {
            return JsonUtil.fromJson(dlCommonPost(RequestBodyBase(actionType, executionType, content = content, jobId = runningId), user), classOfT)
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            throw e
        }
    }

    private fun getJobStatus(runningId: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()): JobStatusParam {
        try {
            val result = dlCommonPost(RequestBodyBase(actionType, executionType, jobId = runningId), user)
            if (result != null && result.has("status") && result.get("status").isJsonPrimitive) {
                return JobStatusParam(
                        result.getAsJsonPrimitive("status").asString,
                        if (result.has("started_date")) result.getAsJsonPrimitive("started_date").asString else "",
                        if (result.has("ended_date")) result.getAsJsonPrimitive("ended_date").asString else ""
                )
            } else {
                logger.error("Cannot get job status. status to UNIDENTIFIED ")
                return JobStatusParam(StatusType.UNIDENTIFIED) //if cannot check job status. return "UNIDENTIFIED"
            }
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server. ${e.message}")
            return JobStatusParam(StatusType.UNIDENTIFIED) //if cannot check job status. return "UNIDENTIFIED"
        }
    }

    private fun getJobText(runningId: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()): String {
        try {
            val result = dlCommonPost(RequestBodyBase(actionType, executionType, jobId = runningId), user)
            if (result != null && result.has("text") && result.get("text").isJsonPrimitive) {
                return result.getAsJsonPrimitive("text").asString
            } else {
                logger.error("Cannot get job error message")
                return "Cannot get job error message"
            }
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            return ExceptionUtils.getStackTrace(e)
        }
    }

    private fun getJobHtml(htmlPath: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()): InferenceJobHtml {
        try {
            val result = dlCommonPost(RequestBodyBase(actionType, executionType, htmlPath = htmlPath), user)
            if (result != null && result.has("html") && result.get("html").isJsonPrimitive) {
                return InferenceJobHtml(result.getAsJsonPrimitive("html").asString)
            } else {
                logger.error("Cannot get job html")
                return InferenceJobHtml("Cannot get job html", false)
            }
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            return InferenceJobHtml(ExceptionUtils.getStackTrace(e), false)
        }
    }

    private fun getTensorboardUrl(outputPath: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()): String {
        try {
            val result = dlCommonPost(RequestBodyBase(actionType, executionType, outputPath = outputPath), user)
            if (result != null && result.has("url") && result.get("url").isJsonPrimitive) {
                return result.getAsJsonPrimitive("url").asString
            } else {
                logger.error("Cannot get job tensorboard url")
                throw BrighticsCoreException("3102", "Cannot get job tensorboard url")
            }
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            throw BrighticsCoreException("4416", " brightics common server").addDetailMessage(ExceptionUtils.getStackTrace(e))
        }
    }

    private fun getJobStatusMetrics(runningId: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()): JsonObject {
        try {
            val result = dlCommonPost(RequestBodyBase(actionType, executionType, jobId = runningId), user)
            if (result != null && result.isJsonObject) {
                return JsonUtil.toJsonObject(result)
            } else {
                logger.info("Cannot get job metrics. metrics to empty")
                return JsonObject()
            }
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            return JsonObject()
        }
    }

    private fun stopJob(runningId: String, actionType: String, executionType: String, user: String = AuthenticationUtil.getRequestUserId()) {
        try {
            dlCommonPost(RequestBodyBase(actionType, executionType, jobId = runningId), user)
        } catch (e: Exception) {
            logger.error("Cannot connect brightics common server.", e)
            throw BrighticsCoreException("4416", " brightics common server").addDetailMessage(ExceptionUtils.getStackTrace(e))
        }
    }
}