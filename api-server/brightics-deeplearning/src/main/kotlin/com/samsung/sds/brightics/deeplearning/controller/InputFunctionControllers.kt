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

import com.samsung.sds.brightics.deeplearning.model.param.InputFunctionParam
import com.samsung.sds.brightics.deeplearning.model.param.PreviewParam
import com.samsung.sds.brightics.deeplearning.service.InputFunctionService
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/dl/input-function")
class InputFunctionController(private val service: InputFunctionService) {

    @GetMapping("")
    fun inputFunctionList(@RequestParam repoTypes: String?, @RequestParam tags: String?) = service.inputFunctionList(repoTypes, tags)

    @GetMapping("/{repoType}/{functionId}")
    fun getInputFunction(@PathVariable repoType: String, @PathVariable functionId: String) = service.getInputFunction(repoType, functionId)

    @PostMapping("/{repoType}")
    fun saveInputFunction(@PathVariable repoType: String, @RequestBody inputFunctionParam: InputFunctionParam) = service.saveInputFunction(repoType, inputFunctionParam)

    @PutMapping("/{repoType}/{functionId}")
    fun updateInputFunction(@PathVariable repoType: String, @PathVariable functionId: String, @RequestBody inputFunctionParam: InputFunctionParam) =
            service.updateInputFunction(repoType, functionId, inputFunctionParam)

    @DeleteMapping("/{repoType}/{functionId}")
    fun deleteInputFunction(@PathVariable repoType: String, @PathVariable functionId: String) = service.deleteInputFunction(repoType, functionId)

    @GetMapping("/tags")
    fun inputFunctionTagList() = service.inputFunctionTagList()

    @GetMapping("/spec")
    fun getInputFunctionSpec() = service.getInputFunctionSpec()

    @PostMapping("/preview")
    fun createPreview(@RequestBody previewParam: PreviewParam) = service.createPreview(previewParam)

    @PostMapping("/preview/{previewId}")
    fun executePreview(@PathVariable previewId: String, @RequestBody previewParam: PreviewParam) = service.executePreview(previewId, previewParam)

    @DeleteMapping("/preview/{previewId}")
    fun deletePreview(@PathVariable previewId: String) = service.deletePreview(previewId)
}