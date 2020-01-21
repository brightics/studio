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

import com.samsung.sds.brightics.common.core.util.JsonUtil
import com.samsung.sds.brightics.deeplearning.common.SpecType
import com.samsung.sds.brightics.deeplearning.common.UdfType
import com.samsung.sds.brightics.deeplearning.common.toClass
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlModelFunction
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlUserDefinedFunction
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import java.time.LocalDateTime

class ModelFunctionParam(
        var id: String = "",
        var label: String = "",
        var tags: List<String> = arrayListOf(),
        var type: String = "",
        var description: String = "",
        var content: FunctionContent? = null,
        var image: String = "",
        var creator: String = AuthenticationUtil.getRequestUserId(),
        var createTime: String = "",
        var updater: String = "",
        var updateTime: String = "",
        var specType: String = SpecType.BASIC) {

    fun convertModelFunction(): BrtcDlModelFunction = run {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        BrtcDlModelFunction(label, tags, description, JsonUtil.toJson(content), image, creator, currentTime, creator, currentTime)
    }

    fun convertUserDefinedFunction(): BrtcDlUserDefinedFunction = run {
        val creator = AuthenticationUtil.getRequestUserId()
        val currentTime = LocalDateTime.now().toString()
        BrtcDlUserDefinedFunction(label, UdfType.MODEL_FUNCTION, tags, description, JsonUtil.toJson(content), image, creator, currentTime, creator, currentTime)
    }

    fun convertModelFunctionFrom(brtcDlModelFunction: BrtcDlModelFunction): BrtcDlModelFunction = run {
        brtcDlModelFunction.label = label
        brtcDlModelFunction.tags = tags
        brtcDlModelFunction.description = description
        brtcDlModelFunction.content = JsonUtil.toJson(content)
        brtcDlModelFunction.image = image
        brtcDlModelFunction.updater = AuthenticationUtil.getRequestUserId()
        brtcDlModelFunction.updateTime = LocalDateTime.now().toString()
        brtcDlModelFunction
    }

    fun convertUserDefinedFunctionFrom(brtcDlUserDefinedFunction: BrtcDlUserDefinedFunction): BrtcDlUserDefinedFunction = run {
        brtcDlUserDefinedFunction.label = label
        brtcDlUserDefinedFunction.tags = tags
        brtcDlUserDefinedFunction.description = description
        brtcDlUserDefinedFunction.content = JsonUtil.toJson(content)
        brtcDlUserDefinedFunction.image = image
        brtcDlUserDefinedFunction.updater = AuthenticationUtil.getRequestUserId()
        brtcDlUserDefinedFunction.updateTime = LocalDateTime.now().toString()
        brtcDlUserDefinedFunction
    }

    companion object {
        fun from(brtcDlModelFunction: BrtcDlModelFunction) = with(brtcDlModelFunction) {
            ModelFunctionParam(id, label, tags, type, description, content.toClass(FunctionContent::class.java), image, creator, createTime, updater, updateTime, SpecType.BASIC)
        }

        fun from(brtcDlUserDefinedFunction: BrtcDlUserDefinedFunction) = with(brtcDlUserDefinedFunction) {
            ModelFunctionParam(id, label, tags, type, description, content.toClass(FunctionContent::class.java), image, creator, createTime, updater, updateTime, SpecType.UDF)
        }
    }
}