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

import com.samsung.sds.brightics.server.model.entity.BrighticsAgentUserMap;
import com.samsung.sds.brightics.server.service.AgentUserService;


@RestController
@RequestMapping("/api/core/v2")
public class AgentUserController {

	@Autowired
	private AgentUserService agentUserService; 

	
	/**
	 *  PUT     /api/v2/agentUser         			: insert agentUser
	 *  POST    /api/v2/agentUser			        : update agentUser by userId	
	 *  DELETE  /api/v2/agentUser/{userId}  		: delete agentUser by userId
	 *  GET     /api/v2/agentUser/{userId}  		: get agent user Info by userId
	 *  GET     /api/v2/agentUsers			 		: get agent users

	 *  GET     /api/v2/agentUser/agent/{agentId}  	: get agent user List by agentId

	 *  GET     /api/v2/agentUsers/exists{userId}	: get agent users
	 *  GET     /api/v2/agentUser/attach/{userId}	: attach agent 
	 *  GET     /api/v2/agentUser/detach/{userId}	: detach agent 

	 *  GET     /api/v2/agentuser/health			: check agent health by user id 
	 *  GET     /api/v2/agentuser/useragentmap		: get user-agent mapping 
	 **/
	
	@RequestMapping(value = "/agentUser", method = RequestMethod.PUT)
	public Map<String, Object> insertAgentUser(@Valid @RequestBody BrighticsAgentUserMap brighticsAgentUser) {
		//parameter : "userId", "agentId", "clientIp", "sessionIp"
		return agentUserService.insertAgentUser(brighticsAgentUser);
	}
	
	@RequestMapping(value = "/agentUser", method = RequestMethod.POST)
	public Map<String, Object> updateAgentUser(@Valid @RequestBody BrighticsAgentUserMap brighticsAgentUser) {
		//parameter : "userId", "agentId", "clientIp", "sessionIp"
		return agentUserService.updateAgentUser(brighticsAgentUser);
	}
	
	@RequestMapping(value = "/agentUser/{userId:.+}", method = RequestMethod.DELETE)
	public Map<String, Object> deleteAgentUser(@PathVariable String userId, HttpServletRequest req) {
		return agentUserService.deleteAgentUser(userId);
	}
	
	@RequestMapping(value = "/agentUser/{userId:.+}", method = RequestMethod.GET)
	public Map<String, Object> getAgentUserInfo(@PathVariable String userId, HttpServletRequest req) {
		return agentUserService.getAgentUserInfo(userId);
	}

	@RequestMapping(value = "/agentUser/agent/{agentId}", method = RequestMethod.GET)
	public Map<String, Object> getAgentUserByAgentId(@PathVariable String agentId) {
		return agentUserService.getAgentUserByAgentId(agentId);
	}
	
	@RequestMapping(value = "/agentUsers", method = RequestMethod.GET)
	public Map<String, Object> getAgentUserList(HttpServletRequest req) {
		return agentUserService.getAgentUserList();
	}
	
	@RequestMapping(value = "/agentUsers/exists/{userId:.+}", method = RequestMethod.GET)
	public Map<String, Object> getAgentUserExist(@PathVariable String userId, HttpServletRequest req) {
		
		req.getCharacterEncoding();
		
		return agentUserService.getAgentUserExist(userId);
	}
	
	@RequestMapping(value = "/agentUser/attach/{userId:.+}", method = RequestMethod.GET)
	public Map<String, Object> attachAgent(@PathVariable String userId, HttpServletRequest req) {
		return agentUserService.attachAgent(userId);
	}

	@RequestMapping(value = "/agentUser/detach/{userId:.+}", method = RequestMethod.GET)
	public Map<String, Object> detachAgent(@PathVariable String userId, HttpServletRequest req) {
		return agentUserService.detachAgent(userId);
	}

	@RequestMapping(value = "/agentuser/health", method = RequestMethod.GET)
	public Map<String, Object> checkAgentHealthByUser() {
		return agentUserService.checkAgentHealthByUser();
	}

	@RequestMapping(value = "/agentuser/useragentmap", method = RequestMethod.GET)
	public Map<String, Object> getUserAgentMapList() {
		return agentUserService.getUserAgentMapList();
	}
	
}
