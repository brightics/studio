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

import com.samsung.sds.brightics.deeplearning.model.entity.BrtcDlUserDefinedFunction
import com.samsung.sds.brightics.server.model.entity.repository.BrtcRepository
import org.springframework.data.jpa.repository.Query
import javax.transaction.Transactional

@Transactional
interface UserDefinedFunctionRepository : BrtcRepository<BrtcDlUserDefinedFunction, String> {

    @Query("SELECT DISTINCT tags FROM BrtcDlUserDefinedFunction udf JOIN udf.tags tags WHERE udf.udfType = ?1")
    fun findDistinctTags(udfType: String): Iterable<String>

    fun findAllByUdfType(udfType: String): Iterable<BrtcDlUserDefinedFunction>

    fun countAllByUdfType(udfType: String): Long
}