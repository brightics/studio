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
import com.samsung.sds.brightics.deeplearning.model.entity.repository.InputFunctionRepository
import com.samsung.sds.brightics.deeplearning.model.entity.repository.UserDefinedFunctionRepository
import com.samsung.sds.brightics.deeplearning.model.param.CommonListParam
import com.samsung.sds.brightics.deeplearning.model.param.InputFunctionParam
import com.samsung.sds.brightics.deeplearning.model.param.PreviewParam
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class InputFunctionService(private val inputFunctionRepository: InputFunctionRepository,
                           private val userDefinedFunctionRepository: UserDefinedFunctionRepository,
                           private val restTemplate: BrighticsDLRestTemplate) {

    private val logger = LoggerFactory.getLogger(InputFunctionService::class.java)

    fun inputFunctionList(repoTypes: String?, tags: String?): List<CommonListParam> = run {
        val typeList = repoTypes?.split(",")
        val resultList = arrayListOf<Any>()
        typeList?.let {
            if (it.contains(RepoType.FILE_BUILT_IN)) resultList.addAll(BuiltInPropertiesUtil.moduleList(ModuleType.INPUT_FUNCTION))
            if (it.contains(RepoType.DB_BASIC)) resultList.addAll(inputFunctionRepository.findAll())
            if (it.contains(RepoType.DB_UDF)) resultList.addAll(userDefinedFunctionRepository.findAllByUdfType(UdfType.INPUT_FUNCTION))
        }
                ?: resultList.addAll(BuiltInPropertiesUtil.moduleList(ModuleType.INPUT_FUNCTION) + inputFunctionRepository.findAll() + userDefinedFunctionRepository.findAllByUdfType(UdfType.INPUT_FUNCTION))
        resultList.summary()
                .filterWithOptionalTags(tags)
                .sortedBy { it.label }
    }

    fun getInputFunction(repoType: String, functionId: String) = run {
        when (repoType) {
            RepoType.FILE_BUILT_IN -> BuiltInPropertiesUtil.getModule(ModuleType.INPUT_FUNCTION, functionId)
            RepoType.DB_BASIC -> InputFunctionParam.from(inputFunctionRepository.findOne(functionId))
            RepoType.DB_UDF -> InputFunctionParam.from(userDefinedFunctionRepository.findOne(functionId))
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun saveInputFunction(repoType: String, inputFunctionParam: InputFunctionParam) = run {
        when (repoType) {
            RepoType.DB_BASIC -> inputFunctionRepository.save(inputFunctionParam.convertInputFunction(), "Input Function").id
            RepoType.DB_UDF -> userDefinedFunctionRepository.save(inputFunctionParam.convertUserDefinedFunction(), "Input Function").id
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun updateInputFunction(repoType: String, functionId: String, inputFunctionParam: InputFunctionParam) {
        when (repoType) {
            RepoType.DB_BASIC -> {
                val inputFunctionEntity = inputFunctionRepository.findOne(functionId)
                inputFunctionRepository.update(inputFunctionParam.convertInputFunctionFrom(inputFunctionEntity), "Input Function")
            }
            RepoType.DB_UDF -> {
                val userDefinedFunctionEntity = userDefinedFunctionRepository.findOne(functionId)
                userDefinedFunctionRepository.update(inputFunctionParam.convertUserDefinedFunctionFrom(userDefinedFunctionEntity), "Input Function")
            }
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun deleteInputFunction(repoType: String, functionId: String) {
        when (repoType) {
            RepoType.DB_BASIC -> inputFunctionRepository.delete(functionId, "Input Function")
            RepoType.DB_UDF -> userDefinedFunctionRepository.delete(functionId, "Input Function")
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun inputFunctionTagList() = (
            BuiltInPropertiesUtil.moduleList(ModuleType.INPUT_FUNCTION).getFlattenTagList() +
                    inputFunctionRepository.findDistinctTags() +
                    userDefinedFunctionRepository.findDistinctTags(UdfType.INPUT_FUNCTION)).distinct().sorted()

    fun inputFunctionCount() = mutableMapOf(
            RepoType.FILE_BUILT_IN to BuiltInPropertiesUtil.moduleList(ModuleType.INPUT_FUNCTION).count(),
            RepoType.DB_BASIC to inputFunctionRepository.count(),
            RepoType.DB_UDF to userDefinedFunctionRepository.countAllByUdfType(UdfType.INPUT_FUNCTION))

    fun getInputFunctionSpec() =
            BuiltInPropertiesUtil.moduleList(ModuleType.INPUT_FUNCTION_SPEC).getLatestFunctionSpecFilterWithDomains(DomainType.toList())

    fun createPreview(previewParam: PreviewParam) = restTemplate.createPreview(previewParam.content!!)

    fun executePreview(previewId: String, previewParam: PreviewParam) = restTemplate.executePreview(previewId, previewParam.option!!)

    fun deletePreview(previewId: String) = restTemplate.deletePreview(previewId)
}