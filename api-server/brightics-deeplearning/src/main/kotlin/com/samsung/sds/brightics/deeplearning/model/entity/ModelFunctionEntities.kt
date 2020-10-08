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

package com.samsung.sds.brightics.deeplearning.model.entity

import com.samsung.sds.brightics.deeplearning.common.RepoType
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Parameter
import javax.persistence.*

@Entity
class BrtcDlModelFunction(label: String, tags: List<String>, description: String, content: String, image: String, creator: String, createTime: String, updater: String, updateTime: String, id: String = "") {
        var label: String = label
        @ElementCollection var tags: List<String> = tags
        @Column(columnDefinition = "text") var description: String = description
        @Column(columnDefinition = "text") var content: String = content
        var image: String = image
        var creator: String = creator
        var createTime: String = createTime
        var updater: String = updater
        var updateTime: String = updateTime
        @Transient var type: String = ""
                get() = RepoType.DB_BASIC
        @Id @GeneratedValue(generator = "model_function")
        @GenericGenerator(name = "model_function"
                , parameters = [Parameter(name = "prefix", value = "mf")]
                , strategy = "com.samsung.sds.brightics.deeplearning.model.entity.generator.CommonPrefixedIdGenerator")
        var id: String = id
}