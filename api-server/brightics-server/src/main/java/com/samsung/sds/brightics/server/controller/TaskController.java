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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.service.TaskService;

@RestController
@RequestMapping("/api/core/v2")
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * GET    /api/core/v2/task/{jid}/{fid}         : get task result as taskId
     * POST   /api/core/v2/task/script/{language}   : execute script
     */

    @RequestMapping(value = "/task/{jid}/{fid}", method = RequestMethod.GET)
    public Object getV2TaskResult(@PathVariable String jid, @PathVariable String fid) {
        return taskService.getTaskResult(jid, fid);
    }

    @RequestMapping(value = "/task/script/{language}", method = RequestMethod.POST)
    public Object executeSyncScript(@PathVariable String language, @RequestBody Map<String, Object> body) throws Exception {
        String script = body.get("body").toString();
        return taskService.executeSyncScript(language, script);
    }
}
