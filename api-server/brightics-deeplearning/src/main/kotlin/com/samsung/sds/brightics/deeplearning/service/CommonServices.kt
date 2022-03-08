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
import com.samsung.sds.brightics.deeplearning.common.*
import com.samsung.sds.brightics.deeplearning.model.param.CommonListParam
import com.samsung.sds.brightics.deeplearning.model.param.ScriptParam
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class CommonService(private val restTemplate: BrighticsDLRestTemplate) {
    private val logger = LoggerFactory.getLogger(CommonService::class.java)

    private val SCRIPT_PREFIX = "script"

    fun getScriptRunnerResult() = restTemplate.executeScriptRunnerResult(getScriptRunnerId())

    fun createScriptRunner(scriptParam: ScriptParam) = restTemplate.createScriptRunner(getScriptRunnerId(), scriptParam)

    fun deleteScriptRunner() = restTemplate.deleteScriptRunner(getScriptRunnerId())

    private fun getScriptRunnerId() = SCRIPT_PREFIX + "_" + AuthenticationUtil.getRequestUserId()
}

@Service
class ModuleService() {
    private val logger = LoggerFactory.getLogger(ModuleService::class.java)

    fun moduleList(moduleType: String, repoTypes: String?, tags: String?): List<CommonListParam> = run {
        val repoTypeList = repoTypes?.split(",")
        val resultList = arrayListOf<Any>()
        repoTypeList?.let {resultList.addAll(BuiltInPropertiesUtil.moduleList(moduleType))
            /* Currently only "built-in" type exists
            if (it.contains(RepoType.DB_BASIC))
            if (it.contains(RepoType.DB_UDF))
             */
        }
                ?: resultList.addAll(BuiltInPropertiesUtil.moduleList(moduleType))
        resultList.summary()
                .filterWithOptionalTags(tags)
                .sortedBy { it.label }
    }

    fun getModule(moduleType: String, repoType: String, id: String) = run {
        when (repoType) {
            RepoType.FILE_BUILT_IN -> BuiltInPropertiesUtil.getModule(moduleType, id)
            /* Currently only "built-in" type exists
            RepoType.DB_BASIC ->
            RepoType.DB_UDF ->
             */
            else -> throw BrighticsCoreException("3010", repoType)
        }

    }

    fun moduleTagList(moduleType: String) = BuiltInPropertiesUtil.moduleList(moduleType).getFlattenTagList().sorted()

    fun getLatestModule(moduleType: String, repoType: String, module: String, name: String) = run {
        when (repoType) {
            RepoType.FILE_BUILT_IN -> BuiltInPropertiesUtil.moduleList(moduleType)
            /* Currently only "built-in" type exists
            RepoType.DB_BASIC ->
            RepoType.DB_UDF ->
             */
            else -> throw BrighticsCoreException("3010", repoType)
        }.filter {
            it.content.module == module && it.content.name == name
        }.sortedByDescending { it.content.updateVersion }.getOrNull(0)
    }

    fun moduleCount(moduleType: String) = mutableMapOf(RepoType.FILE_BUILT_IN to BuiltInPropertiesUtil.moduleList(moduleType).count())
}