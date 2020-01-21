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

import com.samsung.sds.brightics.deeplearning.model.param.ModelFunctionParam
import com.samsung.sds.brightics.deeplearning.service.ModelFunctionService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dl/model-function")
class ModelFunctionController(private val service: ModelFunctionService) {

    @GetMapping("")
    fun modelFunctionList(@RequestParam repoTypes: String?, @RequestParam tags: String?) = service.modelFunctionList(repoTypes, tags)

    @GetMapping("/{repoType}/{functionId}")
    fun getModelFunction(@PathVariable repoType: String, @PathVariable functionId: String) = service.getModelFunction(repoType, functionId)

    @PostMapping("/{repoType}")
    fun saveModelFunction(@PathVariable repoType: String, @RequestBody modelFunctionParam: ModelFunctionParam) = service.saveModelFunction(repoType, modelFunctionParam)

    @PutMapping("/{repoType}/{functionId}")
    fun updateModelFunction(@PathVariable repoType: String, @PathVariable functionId: String, @RequestBody modelFunctionParam: ModelFunctionParam) =
            service.updateModelFunction(repoType, functionId, modelFunctionParam)

    @DeleteMapping("/{repoType}/{functionId}")
    fun deleteModelFunction(@PathVariable repoType: String, @PathVariable functionId: String) = service.deleteModelFunction(repoType, functionId)

    @GetMapping("/tags")
    fun modelFunctionTagList() = service.modelFunctionTagList()

    @GetMapping("/spec")
    fun getModelFunctionSpec() = service.getModelFunctionSpec()
}