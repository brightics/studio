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

package com.samsung.sds.brightics.server.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.samsung.sds.brightics.server.service.TaskService;

@RestController
@RequestMapping("/api/core")
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * GET    /api/core/v2/task/{jid}/{fid}         : get task result as taskId
     * POST   /api/core/v2/task/script/{language}   : execute script
     * GET    /api/core/v3/task/execute/{type}?name={name}  	: execute common task (type : script, function)
     */

    @RequestMapping(value = "/v2/task/{jid}/{fid}", method = RequestMethod.GET)
    public Object getV2TaskResult(@PathVariable String jid, @PathVariable String fid) {
        return taskService.getTaskResult(jid, fid);
    }

    @RequestMapping(value = "/v2/task/script/{language}", method = RequestMethod.POST)
    public Object executeSyncScript(@PathVariable String language, @RequestBody Map<String, Object> body) throws Exception {
        String script = body.get("body").toString();
        return taskService.executeSyncScript(language, script);
    }

    @RequestMapping(value = "/v3/task/execute/{type}", method = RequestMethod.POST)
    public Map<String, Object> executeCommonTask(@PathVariable String type, @RequestParam String name, @RequestBody Object requestBody) {
        return taskService.executeCommonTask(type, name, requestBody);
    }
}
