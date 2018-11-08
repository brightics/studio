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
