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

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.model.entity.BrighticsAgent;
import com.samsung.sds.brightics.server.service.AgentService;

@RestController
@RequestMapping("/api/core/v2")
public class AgentController {

	@Autowired
	private AgentService agentService; 

	/**
	 *  PUT     /api/v2/agent           		: insert agent
	 *  POST    /api/v2/agent			  		: update agent	
	 *  DELETE  /api/v2/agent/{agentId}  		: delete agent
	 *  GET     /api/v2/agent/{agentId}  		: get agent by agentId
	 *  GET     /api/v2/agents          		: get agent list
	 *  GET     /api/v2/agent/exists/{agentId}  : get agent exist
	 *  
	 *  GET     /api/v2/agent/start/{agentId}   : start agent 
	 *  GET     /api/v2/agent/stop/{agentId}    : stop agent
	 *  GET     /api/v2/agent/stopAll   		: stop all agent
	 *  GET     /api/v2/agent/health/{agentId}  : get agent health (RUN or STOP)
	 */
	
	@RequestMapping(value = "/agent", method = RequestMethod.PUT)
	public Map<String, Object> insertAgent(@Valid @RequestBody BrighticsAgent brighticsAgent) {
		//Parameter : "agentId", "agentName", "serverIp", "serverPort", "cores", "memoryPerNodes",
		//"agentDesc", "lastStartTime", "deploySerialNumber", "useYn", "lastStartUser"
		return agentService.insertAgent(brighticsAgent);
	}
	
	@RequestMapping(value = "/agent", method = RequestMethod.POST)
	public Map<String, Object> updateAgent(@Valid @RequestBody BrighticsAgent brighticsAgent) {
		//Parameter : "agentId", "agentName", "serverIp", "serverPort", "cores", "memoryPerNodes",
		//"agentDesc", "lastStartTime", "deploySerialNumber", "useYn", "lastStartUser"
		return agentService.updateAgent(brighticsAgent);
	}

	@RequestMapping(value = "/agent/{agentId}", method = RequestMethod.DELETE)
	public Map<String, Object> deleteAgent(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.deleteAgent(agentId);
	}
	
	@RequestMapping(value = "/agent/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> getAgentInfo(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.getAgentInfo(agentId);
	}
	
	@RequestMapping(value = "/agent/exists/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> checkAgentExists(@PathVariable String agentId, HttpServletRequest req) {
	    return agentService.checkAgentExists(agentId);
	}
	
	@RequestMapping(value = "/agents", method = RequestMethod.GET)
	public Map<String, Object> getAgentList(HttpServletRequest req) {
		return agentService.getAgentList();
	}
	
	@RequestMapping(value = "/agent/start/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> startAgent(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.startAgent(agentId);
	}
	
	@RequestMapping(value = "/agent/stop/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> stopAgent(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.stopAgent(agentId);
	}

	@RequestMapping(value = "/agent/stopAll", method = RequestMethod.GET)
	public Map<String, Object> stopAllAgent(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.stopAllAgent();
	}

	@RequestMapping(value = "/agent/health/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> getAgentHealth(@PathVariable String agentId, HttpServletRequest req) {
		return agentService.getAgentHealth(agentId);
	}

}
