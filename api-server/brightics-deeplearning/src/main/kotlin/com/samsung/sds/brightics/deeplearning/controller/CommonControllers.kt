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

package com.samsung.sds.brightics.deeplearning.controller

import com.samsung.sds.brightics.deeplearning.common.AppProperties
import com.samsung.sds.brightics.deeplearning.common.BuiltInPropertiesUtil
import com.samsung.sds.brightics.deeplearning.model.param.ScriptParam
import com.samsung.sds.brightics.deeplearning.service.*
import org.springframework.security.oauth2.provider.OAuth2Authentication
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletRequest

@RestController
@RequestMapping("/api/dl")
class CommonController(private val service: CommonService,
                       private val appProperties: AppProperties) {

    @GetMapping("/engine-type")
    fun getEngineType() = appProperties.engineType.split(",")

    @GetMapping("/script")
    fun getScriptRunnerResult() = service.getScriptRunnerResult()

    @PostMapping("/script")
    fun createScriptRunner(@RequestBody scriptParam: ScriptParam) = service.createScriptRunner(scriptParam)

    @DeleteMapping("/script")
    fun deleteScriptRunner() = service.deleteScriptRunner()
}

@RestController
@RequestMapping("/api/dl/user")
class UserController {

    @GetMapping("/current")
    fun getCurrentUser(httpServletRequest: HttpServletRequest): Map<String, Any> {
        val principal = httpServletRequest.userPrincipal
        return if (principal != null) {
            val userDetails = (principal as OAuth2Authentication).userAuthentication.details
            if (userDetails != null) {
                val userMap = userDetails as Map<*, *>
                mapOf("userId" to userMap["user_id"]!!, "userName" to userMap["name"]!!)
            } else {
                mapOf("userId" to principal.name)
            }
        } else mapOf()
    }
}

@RestController
@RequestMapping("/api/dl/dashboard")
class DashboardController(private val inputFunctionService: InputFunctionService,
                          private val modelFunctionService: ModelFunctionService,
                          private val trainingJobService: TrainingJobService,
                          private val trainedModelService: TrainedModelService,
                          private val inferenceJobService: InferenceJobService) {

    @GetMapping("/summary")
    fun getSummary(@RequestParam projectId: String?) =
            mapOf("input_functions" to inputFunctionService.inputFunctionCount(),
                    "model_functions" to modelFunctionService.modelFunctionCount(),
                    "training_jobs" to trainingJobService.trainingJobCount(projectId),
                    "trained_models" to trainedModelService.trainedModelCount(projectId),
                    "inference_jobs" to inferenceJobService.inferenceJobCount(projectId))
}

@RestController
@RequestMapping("/api/dl/module")
class ModuleController(private val service: ModuleService) {

    @PutMapping("/init")
    fun initializeModule() = BuiltInPropertiesUtil.initBuiltInProperties()

    @GetMapping("/{moduleType}")
    fun moduleList(@PathVariable moduleType: String, @RequestParam repoTypes: String?, @RequestParam tags: String?) = service.moduleList(moduleType, repoTypes, tags)

    @GetMapping("/{moduleType}/{repoType}/{id}")
    fun getModule(@PathVariable moduleType: String, @PathVariable repoType: String, @PathVariable id: String) = service.getModule(moduleType, repoType, id)

    @GetMapping("/{moduleType}/tags")
    fun moduleTagList(@PathVariable moduleType: String) = service.moduleTagList(moduleType)

    @GetMapping("/{moduleType}/{repoType}/latest")
    fun getLatestModule(@PathVariable moduleType: String, @PathVariable repoType: String, @RequestParam module: String, @RequestParam name: String) =
            service.getLatestModule(moduleType, repoType, module, name)
}