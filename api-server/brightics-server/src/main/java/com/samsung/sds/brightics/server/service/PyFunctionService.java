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

package com.samsung.sds.brightics.server.service;

import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.JsonElement;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcPyFunction;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcPyFunctionRepository;

@Service
public class PyFunctionService {

    private static final Logger logger = LoggerFactory.getLogger(PyFunctionService.class);

    @Autowired
    BrtcPyFunctionRepository repo;

    public String getScript(BrtcPyFunction brtcPyFunction) {
        return getScriptAsId(brtcPyFunction.getScriptId());
    }

    public String getScriptAsId(String scriptId) {
        logger.info("get python function script.");
        BrtcPyFunction targetScript = repo.findOne(scriptId);
        ValidationUtil.throwIfEmpty(targetScript, String.format("PyFunction[%s]", scriptId));
        return targetScript.getScript();
    }

    public String getScriptWithParam(Parameters params) {
        StringBuilder sb = new StringBuilder();
        String scriptId = params.getString("script-id");
        Map<String, JsonElement> filteredParam = params.entrySet().stream().filter(entry -> !"script-id".equals(entry.getKey()))
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue));

        String pythonParamsJson = JsonUtil.toJson(filteredParam);
        if (StringUtils.isNoneBlank(pythonParamsJson)) {
            sb.append(String.format("params = %s", pythonParamsJson));
            sb.append(System.lineSeparator());
        }
        sb.append(getScriptAsId(scriptId));
        String script = sb.toString();
        logger.info("python function execute. script : " + script);
        return script;
    }
}
