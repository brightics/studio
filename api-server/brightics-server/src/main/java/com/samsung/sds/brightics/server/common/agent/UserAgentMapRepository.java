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

package com.samsung.sds.brightics.server.common.agent;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class UserAgentMapRepository {

	private final Map<String, String> userAgentMap = new ConcurrentHashMap<>();

	//save mapping, when start to used agent as some user
	public void saveUserAgentMap(String userId, String agentId){
		userAgentMap.put(userId, agentId);
	}

	public boolean isUserUsedThisAgent(String agentId){
		Set<String> keySet = userAgentMap.keySet();
		for (String userId : keySet) {
			if(userAgentMap.containsKey(userId) 
					&& agentId.equals(userAgentMap.get(userId))){
				return true;
			}
		}
		return false;
	}

	//remove mapping, when agent terminated
	public void removeUserAgentMapAsAgentId(String agentId){
		List<String> removeUserIds = new ArrayList<>();
		Set<String> keySet = userAgentMap.keySet();
		for (String userId : keySet) {
			if(agentId.equals(userAgentMap.get(userId))){
				removeUserIds.add(userId);
			}
		}
		for (String removeUserId : removeUserIds) {
			userAgentMap.remove(removeUserId);
		}
	}

	public String getAgentIdAsUserId(String userId) {
		return userAgentMap.get(userId);
	}

	//remove mapping, when user log out 
	public void removeUserAgentMapAsUserId(String userId){
		userAgentMap.remove(userId);
	}

	public Map<String, String> getUserAgentMap() {
		return userAgentMap;
	}
}
