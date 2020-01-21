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

import com.samsung.sds.brightics.deeplearning.model.param.TrainedModelParam
import com.samsung.sds.brightics.deeplearning.model.param.TrainingJobParam
import com.samsung.sds.brightics.deeplearning.service.TrainedModelService
import com.samsung.sds.brightics.deeplearning.service.TrainingJobService
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/api/dl/training")
class TrainingJobController(private val service: TrainingJobService) {

    @GetMapping("")
    fun trainingJobList(@RequestParam(required = false)  projectId : String?) = service.trainingJobList(projectId)

    @GetMapping("/{trainingId}")
    fun getTrainingJob(@PathVariable trainingId: String) = service.getTrainingJob(trainingId)

    @GetMapping("/{trainingId}/summary")
    fun getTrainingJobSummary(@PathVariable trainingId: String) = service.getTrainingJobSummary(trainingId)

    @GetMapping("/{trainingId}/log")
    fun getTrainingJobLog(@PathVariable trainingId: String) = service.getTrainingJobLog(trainingId)

    @PostMapping("")
    fun saveTrainingJob(@RequestBody trainingJob: TrainingJobParam) = service.saveTrainingJob(trainingJob)

    @PutMapping("/{trainingId}/info")
    fun updateTrainingJobBasicInfo(@PathVariable trainingId: String, @RequestBody trainingJob: TrainingJobParam) = service.updateTrainingJobBasicInfo(trainingId, trainingJob)

    @PutMapping("/list")
    fun updateDeleteYn(@RequestParam trainingIds: String, @RequestParam(required = false, defaultValue = "Y") deleteYn: String) = service.updateDeleteYn(trainingIds, deleteYn)

    @DeleteMapping("/{trainingId}")
    fun stopTrainingJob(@PathVariable trainingId: String) = service.stopTrainingJob(trainingId)

    @GetMapping("/tensorboard")
    fun getTensorboardUrl(@RequestParam outputPath: String) = service.getTensorboardUrl(outputPath)
}

@RestController
@RequestMapping("/api/dl/model")
class TrainedModelController(private val service: TrainedModelService) {

    @GetMapping("")
    fun trainedModelList(@RequestParam(required = false)  projectId : String?, @RequestParam(required = false) type : String?) = service.trainedModelList(projectId, type)

    @GetMapping("/{modelId}")
    fun getTrainedModel(@PathVariable modelId: String) = service.getTrainedModelDetail(modelId)

    @GetMapping("/{modelId}/files")
    fun downloadTrainedModel(@PathVariable modelId: String, @RequestParam(required = false, defaultValue = "false") check : String, response: HttpServletResponse) = service.downloadModel(modelId, check, response)

    @PostMapping("")
    fun saveTrainedModel(@RequestBody trainedModel: TrainedModelParam) = service.saveTrainedModel(trainedModel)

    @PutMapping("/{modelId}/info")
    fun updateTrainedModelBasicInfo(@PathVariable modelId: String, @RequestBody trainedModel: TrainedModelParam) = service.updateTrainedModelBasicInfo(modelId, trainedModel)

    @DeleteMapping("/{modelId}")
    fun deleteTrainedModel(@PathVariable modelId: String) = service.deleteTrainedModel(modelId)
}
