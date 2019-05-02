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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.service.AgentService;
import com.samsung.sds.brightics.server.service.AgentUserService;
import com.samsung.sds.brightics.server.service.DataService;
import com.samsung.sds.brightics.server.service.DataSourceService;
import com.samsung.sds.brightics.server.service.DatabaseService;
import com.samsung.sds.brightics.server.service.JobService;
import com.samsung.sds.brightics.server.service.JobStatusService;
import com.samsung.sds.brightics.server.service.MetadataConverterService;
import com.samsung.sds.brightics.server.service.PyFunctionService;
import com.samsung.sds.brightics.server.service.TaskService;

@Service
public class BeanHolder {
    
    @Autowired
    public AgentService agentService;
    
    @Autowired
    public AgentUserService agentUserService;
    
    @Autowired
    public DataSourceService dataSourceService;
    
    @Autowired
    public JobStatusService jobStatusService;
    
    @Autowired
    public DatabaseService databaseService;
    
    @Autowired
    public JobService suiteService;
    
    @Autowired
    public TaskService taskService;
    
    @Autowired
    public ObjectMapper jacksonObjectMapper;

    @Autowired
    public MessageManagerProvider messageManager;

    @Autowired
    public DataService dataService;

    @Autowired
    public PyFunctionService pyFunctionService;
    
    @Autowired
    public MetadataConverterService metadataConverterService;

}
