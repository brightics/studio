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

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import com.samsung.sds.brightics.deeplearning.common.RepoType
import com.samsung.sds.brightics.deeplearning.common.SpecType

open class BuiltInBase {
    @JsonIgnore lateinit var fileName: String
    val module: String = ""
    val updateVersion: String = ""
    val name: String = ""
    val params: Any? = null
    val _label: String = ""
    val _description: String = ""
    val _tags: List<String> = arrayListOf()
}

open class BuiltInContent: BuiltInBase() {
    @JsonInclude(JsonInclude.Include.NON_NULL) val _specType: String? = SpecType.BASIC
    @JsonInclude(JsonInclude.Include.NON_NULL) val _deprecated: Boolean? = false
    @JsonInclude(JsonInclude.Include.NON_NULL) val _composition: Boolean? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val _contentType: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val _confType: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val _executionType: String? = null
}

class BuiltInParam(val content: BuiltInContent) {
    val id = "bi_" + content.fileName
    val type: String = RepoType.FILE_BUILT_IN
    val label = content._label
    val description = content._description
    val tags = content._tags
    @JsonInclude(JsonInclude.Include.NON_NULL) val specType: String? = content._specType
    @JsonInclude(JsonInclude.Include.NON_NULL) val deprecated: Boolean? = content._deprecated
    @JsonInclude(JsonInclude.Include.NON_NULL) val composition: Boolean? = content._composition
    @JsonInclude(JsonInclude.Include.NON_NULL) val contentType: String? = content._contentType
    @JsonInclude(JsonInclude.Include.NON_NULL) val confType: String? = content._confType
    @JsonInclude(JsonInclude.Include.NON_NULL) val executionType: String? = content._executionType
}

open class CommonListParam(
        val id: String,
        val label: String,
        val description: String,
        val tags: List<String>,
        val type: String,
        @field:JsonInclude(JsonInclude.Include.NON_NULL) val specType: String? = SpecType.BASIC,
        @field:JsonInclude(JsonInclude.Include.NON_NULL) val deprecated: Boolean? = false,
        @field:JsonInclude(JsonInclude.Include.NON_NULL) val contentType: String? = null,
        @field:JsonInclude(JsonInclude.Include.NON_NULL) val confType: String? = null,
        @field:JsonInclude(JsonInclude.Include.NON_NULL) val executionType: String? = null
)

class FunctionContent {
    @JsonInclude(JsonInclude.Include.NON_NULL) val _label: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val _description: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val _tags: List<String>? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val module: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val updateVersion: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val name: String? = null
    @JsonInclude(JsonInclude.Include.NON_NULL) val params: Any? = null
}

class ScriptParam(val code: String)

class ScriptResult(val message: String, val status: String)