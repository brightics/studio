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

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@Component
public class SharedAgentRepository {
	
	private LoadingCache<String, String> userAgentCache;

	@PostConstruct
	public void init() {
		userAgentCache = CacheBuilder.newBuilder().expireAfterAccess(60, TimeUnit.MINUTES)
			.build(new CacheLoader<String, String>() {
				@Override
				public String load(String key) throws Exception {
				    return null;
				}
			});
	}
	
	public String getMostFreeableAgentId(List<String> sharedAgentIdList){
		Collection<String> values = userAgentCache.asMap().values();
		for (String agentId: sharedAgentIdList) {
			if(!values.contains(agentId)){
				return agentId;
			}
		}
		
		Map<String, Integer> agentUserCountMap = new ConcurrentHashMap<>();   
		for (String agentId : values) {
			if(agentUserCountMap.containsKey(agentId)){
				int count = agentUserCountMap.get(agentId);
				agentUserCountMap.put(agentId, count+1);
			} else {
				agentUserCountMap.put(agentId, 1);
			}
		}
		
		Set<String> keySet = agentUserCountMap.keySet();
		String mostFreeableAgentId = "";
		int beforCount = Integer.MAX_VALUE;
		for (String key : keySet) {
			if(beforCount > agentUserCountMap.get(key)){
				beforCount = agentUserCountMap.get(key);
				mostFreeableAgentId = key;
			}
		}
		return mostFreeableAgentId;
	}
	
	public boolean isContainMappedAgent(String userId) {
		return userAgentCache.getIfPresent(userId)!= null;
	}

	public String getAgentId(String userId) {
		return userAgentCache.getIfPresent(userId);
	}
	
	public void saveMappedAgentAsUser(String userId, String agentId) {
		userAgentCache.put(userId, agentId);
	}
	
}
