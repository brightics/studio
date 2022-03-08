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
import com.google.gson.reflect.TypeToken
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder

class Metric(var keys: List<String> = ArrayList(),
             var data: List<MutableMap<String, Any>> = ArrayList(),
             @JsonInclude(JsonInclude.Include.NON_EMPTY) var bestModel: Any? = null
)

open class JobSummaryParam(
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var status: String = "",
        @JsonInclude(JsonInclude.Include.NON_NULL)
        var metrics: Map<String, Metric>? = null,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var startTime: String = "",
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var runningId: String = "",
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var message: String = "",
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var endTime: String? = "",
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var outputPath: String? = null,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var htmlPath: String? = null,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var htmlString: String? = null,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var validHtml: Boolean? = null,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        var type: String? = null
) {

    constructor(status: String, metrics: String, startTime: String, runningId: String, message: String, endTime: String? = null, outputPath: String? = null, htmlPath: String? = null, htmlString: String? = null, validHtml: Boolean? = null, type: String? = null) : this() {
        this.status = status
        this.metrics = BrighticsGsonBuilder.getGsonInstance().fromJson(metrics, object : TypeToken<Map<String, Metric>>() {}.type)
        this.startTime = startTime
        this.runningId = runningId
        this.message = message
        this.endTime = endTime
        this.outputPath = outputPath
        this.htmlPath = htmlPath
        this.htmlString = htmlString
        this.validHtml = validHtml
        this.type = type
    }

}

class JobStatusParam(val status: String, val startTime: String = "", val endTime: String = "")