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

package com.samsung.sds.brightics.deeplearning.model.entity.repository

import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlTrainedModel
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlTrainingJob
import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlTrainingJobSummary
import com.samsung.sds.brightics.server.model.entity.repository.BrtcRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import javax.transaction.Transactional

@Transactional
interface TrainingJobRepository : BrtcRepository<BrtcDlTrainingJob, String> {
    fun findAllByProjectIdAndDeleteYnOrderByCreateTimeDesc(projectId: String, deleteYn: String): List<BrtcDlTrainingJob>
    fun findAllByDeleteYnOrderByCreateTimeDesc(deleteYn: String): List<BrtcDlTrainingJob>

    @Modifying(clearAutomatically = true)
    @Query("UPDATE BrtcDlTrainingJob SET deleteYn = ?2 WHERE id IN ?1")
    fun updateDeleteYnByIdList(trainingIdList: List<String>, deleteYn: String)
}

@Transactional
interface TrainingJobSummaryRepository : BrtcRepository<BrtcDlTrainingJobSummary, String>

@Transactional
interface TrainedModelRepository : BrtcRepository<BrtcDlTrainedModel, String> {
    fun findAllByProjectIdOrderByCreateTimeDesc(projectId: String): List<BrtcDlTrainedModel>
    fun findAllByProjectIdAndTypeOrderByCreateTimeDesc(projectId: String, type: String): List<BrtcDlTrainedModel>
    fun findAllByOrderByCreateTimeDesc(): List<BrtcDlTrainedModel>
    fun findAllByTypeOrderByCreateTimeDesc(type: String): List<BrtcDlTrainedModel>
}