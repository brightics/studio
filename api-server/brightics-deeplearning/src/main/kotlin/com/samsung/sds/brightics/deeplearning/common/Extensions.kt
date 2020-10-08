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

import com.fasterxml.jackson.databind.ObjectMapper
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlInputFunction
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlModelFunction
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlUserDefinedFunction
import com.samsung.sds.brightics.deeplearning.model.param.*
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import java.io.InputStream

fun List<Any>.summary() = map {
    when (it) {
        is BuiltInParam -> with(it) { CommonListParam(id, label, description, tags, RepoType.FILE_BUILT_IN, specType, deprecated, contentType, confType, executionType) }
        is BrtcDlUserDefinedFunction -> with(it) { CommonListParam(id, label, description, tags, RepoType.DB_UDF, SpecType.UDF) }
        is BrtcDlInputFunction -> with(it) { CommonListParam(id, label, description, tags, RepoType.DB_BASIC, SpecType.BASIC) }
        is BrtcDlModelFunction -> with(it) { CommonListParam(id, label, description, tags, RepoType.DB_BASIC, SpecType.BASIC) }
        else -> throw BrighticsCoreException("3010", it::class.simpleName)
    }
}

fun List<Any>.filterWithSessionUser(): List<Any> {
    val sessionUser = AuthenticationUtil.getRequestUserId()
    return this.filter {
        when (it) {
            is TrainingJobParam -> it.creator == sessionUser
            is TrainedModelParam -> it.creator == sessionUser
            is InferenceJobParam -> it.creator == sessionUser
            else -> throw BrighticsCoreException("3010", it::class.simpleName)
        }
    }
}

fun List<CommonListParam>.filterWithOptionalTags(tags: String?) = tags?.let { this.filter { it.tags.containsAll(tags.split(",")) } } ?: this

fun List<BuiltInParam>.getLatestFunctionSpecFilterWithDomains(domains: List<String>) =
        domains.map { domain -> domain to this.filter { it.tags.containsAll(domain.toLowerCase().split("/")) }.sortedByDescending { it.content.updateVersion }.getOrNull(0) }.toMap()

fun List<BuiltInParam>.getFlattenTagList() = map { it.tags }.flatten().distinct()


fun <T> String.toClass(classOfT: Class<T>): T = ObjectMapper().readValue(this, classOfT)

fun <T> InputStream.toClass(classOfT: Class<T>): T = ObjectMapper().readValue(this, classOfT)