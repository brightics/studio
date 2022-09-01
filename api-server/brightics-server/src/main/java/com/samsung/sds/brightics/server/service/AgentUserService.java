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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.agent.SharedAgentRepository;
import com.samsung.sds.brightics.server.common.agent.UserAgentMapRepository;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrighticsAgentUserMap;
import com.samsung.sds.brightics.server.model.entity.repository.BrighticsAgentUserMapRepository;

@Service
public class AgentUserService {

	private static final Logger logger = LoggerFactory.getLogger(AgentUserService.class);

	@Lazy
	@Autowired
	private AgentService agentService;

	@Autowired
	private SharedAgentRepository sharedAgentRepository;

	@Autowired
	private UserAgentMapRepository userAgentMapRepository;
	
	@Autowired
    private BrighticsAgentUserMapRepository brighticsAgentUserMapRepository;

	private static final String DYNAMIC_AGENT = "DYNAMIC";
	private static final String USER_SERVICE_NAME = "user";

	public Map<String, Object> insertAgentUser(BrighticsAgentUserMap brighticsAgentUser) {
		if(!DYNAMIC_AGENT.equals(brighticsAgentUser.getAgentId())){
			agentService.getBrighticsAgentOrThrow(brighticsAgentUser.getAgentId());
		}
		if(brighticsAgentUserMapRepository.exists(brighticsAgentUser.getUserId())){
			brighticsAgentUserMapRepository.delete(brighticsAgentUser.getUserId(), USER_SERVICE_NAME);
		}
		brighticsAgentUserMapRepository.save(brighticsAgentUser, USER_SERVICE_NAME);
		return ResultMapUtil.success("count", "1");
	}

	public Map<String, Object> updateAgentUser(BrighticsAgentUserMap brighticsAgentUser) {
		
		if(!DYNAMIC_AGENT.equals(brighticsAgentUser.getAgentId())) {
			agentService.getBrighticsAgentOrThrow(brighticsAgentUser.getAgentId());
		}
		brighticsAgentUserMapRepository.update(brighticsAgentUser, USER_SERVICE_NAME);
		return ResultMapUtil.success("count", "1");
	}

	public Map<String, Object> deleteAgentUser(String userId) {
		if(StringUtils.equals(userId, "guest")||StringUtils.equals(userId, "admin")){
			throw new BrighticsCoreException("3007", "user");
		}
		brighticsAgentUserMapRepository.delete(userId , USER_SERVICE_NAME);
		return ResultMapUtil.success("count", "1");
	}
	
	public void deleteAgentUserAsAgentId(String agentId) {
		List<BrighticsAgentUserMap> BrighticsAgentUserList = brighticsAgentUserMapRepository.findByAgentId(agentId);
		if(BrighticsAgentUserList!=null && BrighticsAgentUserList.size()>0){
			for (BrighticsAgentUserMap brighticsAgentUserMap : BrighticsAgentUserList) {
				brighticsAgentUserMapRepository.delete(brighticsAgentUserMap.getUserId(), USER_SERVICE_NAME);
			}
		}
	}
	
	public Map<String, Object> getAgentUserInfo(String userId) {
		BrighticsAgentUserMap brighticsAgentUser= brighticsAgentUserMapRepository.findOne(userId);
		ValidationUtil.throwIfEmpty(brighticsAgentUser, "user");
		return ResultMapUtil.success(brighticsAgentUser);
	}

	public Map<String, Object> getAgentUserByAgentId(String agentId) {
		List<BrighticsAgentUserMap> brighticsAgentUserList= brighticsAgentUserMapRepository.findByAgentId(agentId);
		return ResultMapUtil.success(brighticsAgentUserList);
	}

	public Map<String, Object> getAgentUserList() {
		return ResultMapUtil.success(brighticsAgentUserMapRepository.findAll());
	}

	//If request user id is null, request user id is guest 
	public String getAgentIdByCurrentUser() {
		String userId = AuthenticationUtil.getRequestUserId();
		return getAgentIdAsUserId(userId);
	}

	public String getAgentIdAsUserId(String userId) {
		//(if agent mapping result is null) Default agent BRIGHTICS
		String resultAgentId = AgentService.DEFAULT_AGENT_ID;
		BrighticsAgentUserMap brighticsAgentUser= brighticsAgentUserMapRepository.findOne(userId);
		if (brighticsAgentUser != null) {
			String agentId = brighticsAgentUser.getAgentId();
			if(DYNAMIC_AGENT.equals(agentId)){
				// get shared agent 
				List<String> sharedAgentList = agentService.getUsedSharedAgentIDList();
				ValidationUtil.throwIfEmpty(sharedAgentList, "shared agent");
				if(sharedAgentRepository.isContainMappedAgent(userId)
						&& sharedAgentList.contains(sharedAgentRepository.getAgentId(userId))){
					resultAgentId = sharedAgentRepository.getAgentId(userId);
				} else {
					String sharedAgentId = sharedAgentRepository.getMostFreeableAgentId(sharedAgentList);
					sharedAgentRepository.saveMappedAgentAsUser(userId, sharedAgentId);
					resultAgentId = sharedAgentId;
				}
			} else {
				resultAgentId = brighticsAgentUser.getAgentId();
			}
		} else {
			BrighticsAgentUserMap guestInfo= brighticsAgentUserMapRepository.findOne("guest");
			if(guestInfo != null){
				resultAgentId = guestInfo.getAgentId();
			}
		}
		
		// save userID - agent ID
		userAgentMapRepository.saveUserAgentMap(userId, resultAgentId);
		return resultAgentId;
	}
	
	public Map<String, Object> detachAgent(String userId){
		//get mapped agent Id 
		String agentId = userAgentMapRepository.getAgentIdAsUserId(userId);
		// 1. delete user agent map
		userAgentMapRepository.removeUserAgentMapAsUserId(userId);
		
		// 2. check agent status and stop agent
		if (!userAgentMapRepository.isUserUsedThisAgent(agentId) && !TaskMessageRepository.isExistRunningMessage(agentId)) {
			agentService.stopAgent(agentId);
			logger.info("[user("+ userId +") logout request] Stop agent success. agent Id : " + agentId);
			return ResultMapUtil.success("[user("+ userId +") logout request] Stop agent success. agent Id : " + agentId);
		} else {
			logger.info("[user("+ userId +") logout request] Agent used by another user. agent Id : " + agentId);
			return ResultMapUtil.success("[user("+ userId +") logout request] Agent used by another user. agent Id : " + agentId);
		}
	}
	
	/**
	 * [Attach Process]
	 * 
	 * 1. Agent 를 확인 한다. 2. User, Session, Agent 정보를 저장한다. 3. Agent 를 start 한다.
	 * (start 실패 시 저장 취소)
	 **/
	public Map<String, Object> attachAgent(String requestUserId) {
		String agentId = getAgentIdAsUserId(requestUserId);
		logger.info(
				"[Agent User] Agent start to attach. " + "agentId : " + agentId + ", requestUserId : " + requestUserId);
		return agentService.startAgent(agentId);
	}

	public Map<String, Object> getAgentUserExist(String userId) {
		BrighticsAgentUserMap brighticsAgentUser= brighticsAgentUserMapRepository.findOne(userId);
		ValidationUtil.throwWhen(brighticsAgentUser!=null, "3002", "user");
        return ResultMapUtil.success("UserID is not duplicate.");
	}

	public Map<String, Object> checkAgentHealthByUser() {
		String agentId = getAgentIdByCurrentUser();
		return agentService.getAgentHealth(agentId);
	}

	public Map<String, Object> getUserAgentMapList() {
		Map<String, String> userAgentMap = userAgentMapRepository.getUserAgentMap();
		Set<String> keySet = userAgentMap.keySet();
		List<BrighticsAgentUserMap> resultDTOList = new ArrayList<>();
		for (String userId : keySet) {
			
			BrighticsAgentUserMap brighticsAgentUserMap = new BrighticsAgentUserMap();
			brighticsAgentUserMap.setUserId(userId);
			brighticsAgentUserMap.setAgentId(userAgentMap.get(userId));
			resultDTOList.add(brighticsAgentUserMap);
		}
		return ResultMapUtil.success(resultDTOList);
	}
}
