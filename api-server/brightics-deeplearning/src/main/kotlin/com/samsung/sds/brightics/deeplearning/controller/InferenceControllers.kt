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

import com.samsung.sds.brightics.deeplearning.model.param.InferenceJobParam
import com.samsung.sds.brightics.deeplearning.service.InferenceJobService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dl/inference")
class InferenceJobController(private val service: InferenceJobService) {

    @GetMapping("")
    fun inferenceJobList(@RequestParam(required = false) projectid: String?) = service.inferenceJobList(projectid)

    @GetMapping("/{inferenceId}")
    fun getInferenceJob(@PathVariable inferenceId: String) = service.getInferenceJob(inferenceId)

    @GetMapping("/{inferenceId}/summary")
    fun getInferenceJobSummary(@PathVariable inferenceId: String) = service.getInferenceJobSummary(inferenceId)

    @GetMapping("/{inferenceId}/log")
    fun getInferenceJobLog(@PathVariable inferenceId: String) = service.getInferenceJobLog(inferenceId)

    @PostMapping("")
    fun saveInferenceJob(@RequestBody inferenceJob: InferenceJobParam) = service.saveInferenceJob(inferenceJob)

    @PutMapping("/{inferenceId}/info")
    fun updateInferenceJobBasicInfo(@PathVariable inferenceId: String, @RequestBody inferenceJob: InferenceJobParam) = service.updateInferenceJobBasicInfo(inferenceId, inferenceJob)

    @PutMapping("/list")
    fun updateDeleteYn(@RequestParam inferenceIds: String, @RequestParam(required = false, defaultValue = "Y") deleteYn: String) = service.updateDeleteYn(inferenceIds, deleteYn)

    @DeleteMapping("/{inferenceId}")
    fun stopInferenceJob(@PathVariable inferenceId: String) = service.stopInferenceJob(inferenceId)
}