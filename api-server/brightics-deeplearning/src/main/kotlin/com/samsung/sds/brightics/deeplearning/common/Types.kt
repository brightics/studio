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

object DomainType {
    // In case of multi-value, delimiter("/") should be used.
    const val IMAGE_CLASSIFICATION = "Image/Classification"
    fun toList() = listOf(IMAGE_CLASSIFICATION)
}

object RepoType {
    const val FILE_BUILT_IN = "built-in"
    const val DB_BASIC = "basic"
    const val DB_UDF = "udf"
}

object SpecType {
    const val BASIC = "basic"
    const val UDF = "udf"
}

object ModuleType {
    const val INPUT_FUNCTION = "input-function"
    const val MODEL_FUNCTION = "model-function"
    const val INPUT_FUNCTION_SPEC = "input-function-spec"
    const val MODEL_FUNCTION_SPEC = "model-function-spec"
}

object UdfType {
    const val INPUT_FUNCTION = "input-function"
    const val MODEL_FUNCTION = "model-function"
}

object StatusType {
    const val STARTED = "Started"
    const val STOPPED = "Cancelled"
    const val FAILED = "Failed"
    const val RUNNING = "Running"
    const val COMPLETED = "Success"
    const val WAIT = "Waiting"
    const val READY = "Initiated"
    const val UNIDENTIFIED = "Unidentified"
    fun isFinishStatusType(type: String)= listOf(STOPPED, FAILED, COMPLETED).contains(type)
}

object TrainedModeType {
    const val PRE_TRAINED = "pre_trained"
    const val DEFAULT = "default"
}

object TrainingJobType {
    const val DEFAULT = "default"
}

//The type that determines the deep learning module in DL-Engine.
object ExecutionType {
    const val DEFAULT = "default"
}

//The type that determines the execution action of the deep learning module in agent.
object ExecuteActionType {
    const val JOB_EXECUTE_TRAINING  = "job_execute_training"
    const val JOB_EXECUTE_INFERENCE = "job_execute_inference"

    const val JOB_STATUS_TRAINING  = "job_status_training"
    const val JOB_STATUS_INFERENCE = "job_status_inference"

    const val JOB_TEXT_TRAINING  = "job_text_training"
    const val JOB_TEXT_INFERENCE = "job_text_inference"

    const val JOB_LOG_TRAINING  = "job_log_training"
    const val JOB_LOG_INFERENCE = "job_log_inference"

    const val JOB_HTML_INFERENCE = "job_html_inference"

    const val JOB_TENSORBOARD_URL = "job_tensorboard_url"

    const val JOB_METRICS_TRAINING  = "job_metrics_training"

    const val JOB_STOP_TRAINING  = "job_stop_training"
    const val JOB_STOP_INFERENCE = "job_stop_inference"

    const val PREVIEW_CREATE = "preview_create"
    const val PREVIEW_NEXT   = "preview_next"
    const val PREVIEW_DELETE = "preview_delete"

    const val SCRIPT_RUNNER_CREATE = "script_runner_create"
    const val SCRIPT_RUNNER_RESULT = "script_runner_result"
    const val SCRIPT_RUNNER_DELETE = "script_runner_delete"
}