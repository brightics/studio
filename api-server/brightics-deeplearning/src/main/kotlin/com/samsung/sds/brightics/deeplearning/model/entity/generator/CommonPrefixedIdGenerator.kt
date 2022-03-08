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

package com.samsung.sds.brightics.deeplearning.model.entity.generator

import org.apache.commons.lang3.RandomStringUtils
import org.hibernate.engine.spi.SharedSessionContractImplementor
import org.hibernate.id.Configurable
import org.hibernate.id.IdentifierGenerator
import org.hibernate.service.ServiceRegistry
import org.hibernate.type.Type
import java.io.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

class CommonPrefixedIdGenerator : IdentifierGenerator, Configurable {

    var prefix: String? = ""

    override fun generate(session: SharedSessionContractImplementor, obj: Any): Serializable {
        return generateJid()
    }

    override fun configure(type: Type?, params: Properties, serviceRegistry: ServiceRegistry?) {
        prefix = params.getProperty("prefix")
    }

    private fun generateJid(): String {
        val current = LocalDateTime.now()
        return prefix + "_" + RandomStringUtils.randomAlphanumeric(4) + "_" + current.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSSS"))
    }
}