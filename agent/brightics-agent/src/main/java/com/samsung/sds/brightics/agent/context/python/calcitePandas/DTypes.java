/*
    Copyright 2019 Samsung SDS

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

package com.samsung.sds.brightics.agent.context.python.calcitePandas;

import com.google.common.collect.ImmutableList;

import java.util.List;

public enum DTypes {
    OBJECT("object"),
    INT64("int64"),
    FLOAT64("float64"),
    BOOL("bool");

    private static final List<DTypes> all_types =
            ImmutableList.of(OBJECT, INT64, FLOAT64, BOOL);

    private static final List<DTypes> numeric_types =
            ImmutableList.of(INT64, FLOAT64);

    final private String type;

    private DTypes(String type) {
        this.type = type;
    }

    public String getPdType() {
        return this.type;
    }

    public List<DTypes> getAllTypes() {
        return DTypes.all_types;
    }

    public List<DTypes> getNumericTypes() {
        return DTypes.numeric_types;
    }

}
