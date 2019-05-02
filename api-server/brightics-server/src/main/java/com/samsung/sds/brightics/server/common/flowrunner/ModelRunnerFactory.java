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

package com.samsung.sds.brightics.server.common.flowrunner;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

final class ModelRunnerFactory {

    private ModelRunnerFactory() {
        // nothing to do
    }

    public static IModelRunner create(String pid, JsonObject model) {
        switch (model.get("type").getAsString()) {
            case "data":
            case "etl":
            case "script":
                return new WorkflowModelRunner(model, pid);
            default:
                throw new BrighticsCoreException("3105");
        }
    }
}
