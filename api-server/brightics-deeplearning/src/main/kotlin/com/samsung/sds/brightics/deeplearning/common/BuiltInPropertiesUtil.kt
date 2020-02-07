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

import com.samsung.sds.brightics.deeplearning.model.param.BuiltInContent
import com.samsung.sds.brightics.deeplearning.model.param.BuiltInParam
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.File
import java.io.FileInputStream
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.util.*

object BuiltInPropertiesUtil {

    private val logger = LoggerFactory.getLogger(BuiltInPropertiesUtil::class.java)
    private var builtInMap: MutableMap<String, MutableMap<String, BuiltInParam>> = HashMap()

    private const val PATH_BUILTIN = "built-in"

    fun moduleList(moduleType: String): List<BuiltInParam> = builtInMap[moduleType]?.values?.toList() ?: listOf()
    fun getModule(moduleType: String, id: String): BuiltInParam = builtInMap[moduleType]?.get(id)!!

    fun initBuiltInProperties() {
        logger.info("Initializing built-in properties.")

        try {
            val classLoader = Thread.currentThread().contextClassLoader
            val builtInFolder = File(URLDecoder.decode(classLoader.getResource(PATH_BUILTIN)!!.file, StandardCharsets.UTF_8.toString()))

            for (typeFolder in builtInFolder.listFiles()!!) {
                val moduleType = typeFolder.name
                builtInMap[moduleType] = HashMap()
                File(typeFolder.toPath().toString()).walkTopDown().forEach {
                    if (it.name.matches(".*.json".toRegex())) setBuiltInProperties(moduleType, it)
                }
            }
        } catch (e: Exception) {
            logger.error("Cannot initialize built-in properties.", e)
        }

    }

    private fun setBuiltInProperties(moduleType: String, builtInFile: File) {
        val fileName = builtInFile.name
        try {
            val builtInContent = FileInputStream(builtInFile).toClass(BuiltInContent::class.java)
            builtInContent.fileName = File(fileName).nameWithoutExtension
            BuiltInParam(builtInContent).let { builtInMap[moduleType]?.set(it.id, it) }
        } catch (e: Exception) {
            logger.error("Cannot initialize built-in json. file name : $fileName", e)
        }
    }
}

@Configuration
class BuiltInInitializer {

    @Bean
    fun initBuiltInProperties() = CommandLineRunner {
        BuiltInPropertiesUtil.initBuiltInProperties()
    }
}