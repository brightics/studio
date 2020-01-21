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

package com.samsung.sds.brightics.deeplearning.common

import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException
import com.samsung.sds.brightics.server.model.vo.ExceptionInfoVO
import org.apache.commons.lang3.exception.ExceptionUtils
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@ControllerAdvice
class ExceptionHandler {

    private val logger = LoggerFactory.getLogger(ExceptionHandler::class.java!!)

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @org.springframework.web.bind.annotation.ExceptionHandler(value = [Exception::class])
    fun handleServerException(exception: Exception): ExceptionInfoVO {
        return when (exception) {
            is AbsBrighticsException -> {
                logger.error("[SYSTEM]", exception)
                ExceptionInfoVO(exception.localizedMessage, exception.detailedCause)
            }
            else -> {
                logger.error("[SYSTEM]", exception)
                ExceptionInfoVO("A system error has occurred. Contact administrator."
                        , ExceptionUtils.getMessage(exception))
            }
        }
    }

}
