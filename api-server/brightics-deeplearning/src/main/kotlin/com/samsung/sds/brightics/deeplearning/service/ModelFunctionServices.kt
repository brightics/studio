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
import com.samsung.sds.brightics.deeplearning.model.entity.repository.ModelFunctionRepository
import com.samsung.sds.brightics.deeplearning.model.entity.repository.UserDefinedFunctionRepository
import com.samsung.sds.brightics.deeplearning.model.param.CommonListParam
import com.samsung.sds.brightics.deeplearning.model.param.ModelFunctionParam
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ModelFunctionService(private val modelFunctionRepository: ModelFunctionRepository,
                           private val userDefinedFunctionRepository: UserDefinedFunctionRepository) {

    private val logger = LoggerFactory.getLogger(ModelFunctionService::class.java)

    fun modelFunctionList(repoTypes: String?, tags: String?): List<CommonListParam> = run {
        val typeList = repoTypes?.split(",")
        val resultList = arrayListOf<Any>()
        typeList?.let {
            if (it.contains(RepoType.FILE_BUILT_IN)) resultList.addAll(BuiltInPropertiesUtil.moduleList(ModuleType.MODEL_FUNCTION))
            if (it.contains(RepoType.DB_BASIC)) resultList.addAll(modelFunctionRepository.findAll())
            if (it.contains(RepoType.DB_UDF)) resultList.addAll(userDefinedFunctionRepository.findAllByUdfType(UdfType.MODEL_FUNCTION))
        }
                ?: resultList.addAll(BuiltInPropertiesUtil.moduleList(ModuleType.MODEL_FUNCTION) + modelFunctionRepository.findAll() + userDefinedFunctionRepository.findAllByUdfType(UdfType.MODEL_FUNCTION))
        resultList.summary()
                .filterWithOptionalTags(tags)
                .sortedBy { it.label }
    }

    fun getModelFunction(repoType: String, functionId: String) = run {
        when (repoType) {
            RepoType.FILE_BUILT_IN -> BuiltInPropertiesUtil.getModule(ModuleType.MODEL_FUNCTION, functionId)
            RepoType.DB_BASIC -> ModelFunctionParam.from(modelFunctionRepository.findOne(functionId))
            RepoType.DB_UDF -> ModelFunctionParam.from(userDefinedFunctionRepository.findOne(functionId))
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun saveModelFunction(repoType: String, modelFunctionParam: ModelFunctionParam) = run {
        when (repoType) {
            RepoType.DB_BASIC -> modelFunctionRepository.save(modelFunctionParam.convertModelFunction(), "Model Function").id
            RepoType.DB_UDF -> userDefinedFunctionRepository.save(modelFunctionParam.convertUserDefinedFunction(), "Model Function").id
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun updateModelFunction(repoType: String, functionId: String, modelFunctionParam: ModelFunctionParam) {
        when (repoType) {
            RepoType.DB_BASIC -> {
                val modelFunctionEntity = modelFunctionRepository.findOne(functionId)
                modelFunctionRepository.update(modelFunctionParam.convertModelFunctionFrom(modelFunctionEntity), "Model Function")
            }
            RepoType.DB_UDF -> {
                val userDefinedFunctionEntity = userDefinedFunctionRepository.findOne(functionId)
                userDefinedFunctionRepository.update(modelFunctionParam.convertUserDefinedFunctionFrom(userDefinedFunctionEntity), "Model Function")
            }
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun deleteModelFunction(repoType: String, functionId: String) {
        when (repoType) {
            RepoType.DB_BASIC -> modelFunctionRepository.delete(functionId, "Model Function")
            RepoType.DB_UDF -> userDefinedFunctionRepository.delete(functionId, "Model Function")
            else -> throw BrighticsCoreException("3010", repoType)
        }
    }

    fun modelFunctionTagList() = (
            BuiltInPropertiesUtil.moduleList(ModuleType.MODEL_FUNCTION).getFlattenTagList() +
                    modelFunctionRepository.findDistinctTags() +
                    userDefinedFunctionRepository.findDistinctTags(UdfType.MODEL_FUNCTION)).distinct().sorted()

    fun modelFunctionCount() = mutableMapOf(
            RepoType.FILE_BUILT_IN to BuiltInPropertiesUtil.moduleList(ModuleType.MODEL_FUNCTION).count(),
            RepoType.DB_BASIC to modelFunctionRepository.count(),
            RepoType.DB_UDF to userDefinedFunctionRepository.countAllByUdfType(UdfType.MODEL_FUNCTION))

    fun getModelFunctionSpec() =
            BuiltInPropertiesUtil.moduleList(ModuleType.MODEL_FUNCTION_SPEC).getLatestFunctionSpecFilterWithDomains(DomainType.toList())
}