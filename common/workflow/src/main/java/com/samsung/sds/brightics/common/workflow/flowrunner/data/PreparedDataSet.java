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

package com.samsung.sds.brightics.common.workflow.flowrunner.data;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.PreparedDataVO;

public class PreparedDataSet {

	@JsonIgnore
	private ConcurrentHashMap<String, JsonObject> preparedDataSet = new ConcurrentHashMap<>();

	private static final String KEY_SEP = "_";

	private String getPreparedDataKey(String mid, String fid) {
		return mid + KEY_SEP + fid;
	}

	public void addPreparedData(PreparedDataVO preparedData) {
		String mid = preparedData.getMid();
		String fid = preparedData.getFid();
		String tid = preparedData.getTid();

		String preparedDataKey = getPreparedDataKey(mid, fid);
		if (preparedDataSet.containsKey(preparedDataKey)) {
			preparedDataSet.get(preparedDataKey).add(tid, JsonUtil.toJsonObject(preparedData.getData()));
		} else {
			Map<String, JsonObject> dataByTIDMap = new HashMap<>();
			dataByTIDMap.put(tid, JsonUtil.toJsonObject(preparedData.getData()));
			preparedDataSet.put(preparedDataKey, JsonUtil.toJsonObject(dataByTIDMap));
		}
	}

	public boolean hasPreparedData(String mid, String fid) {
		return preparedDataSet.containsKey(getPreparedDataKey(mid, fid));
	}

	public JsonObject getFunctionPreparedDataSet(String mid, String fid) {
		return preparedDataSet.get(getPreparedDataKey(mid, fid));
	}

	public JsonObject getFunctionPreparedDataAsTID(String mid, String fid, String tid) {
		return preparedDataSet.get(getPreparedDataKey(mid, fid)).get(tid).getAsJsonObject();
	}
}
