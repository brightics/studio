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

package com.samsung.sds.brightics.server.common.holder;

import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import com.samsung.sds.brightics.common.variable.storage.impl.LocalFsStorage;
import com.samsung.sds.brightics.server.common.flowrunner.jslib.MomentJsLibrary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class VariableContextHolder {

    private static final Logger LOGGER = LoggerFactory.getLogger(VariableContextHolder.class);

    private static Map<String, VariableContext> variableContextMap = new ConcurrentHashMap<>();

    private static final String variableRepo = "./variables";

    public static VariableContext getUserVariableContext(String user) {
        return Optional.ofNullable(variableContextMap.get(user))
                .orElseGet(() -> {
                    VariableContext newVariableContext = new VariableContext(getUserVariableScope(user));
                    newVariableContext.addJsLibrary(new MomentJsLibrary());
                    return newVariableContext;
                });
    }

    private static VariableScope getUserVariableScope(String user) {
        File repoDir = new File(variableRepo);
        if (!repoDir.exists() && !repoDir.mkdir()) {
            LOGGER.debug("{} already exists", variableRepo);
        }

        VariableScope userScope = new VariableScope("user",
                new LocalFsStorage(variableRepo + "/" + user + ".v"));

        userScope.evaluate("user", "var sys = sys || {}");
        userScope.evaluate("user", "sys.user = '" + user + "'");

        return userScope;
    }

    public static void clearVariableContext(String user) {
        variableContextMap.remove(user);
    }
}
