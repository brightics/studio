package com.samsung.sds.brightics.common.workflow.flowrunner.data;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.JsonUtil;

public class PreparedDataSet {

	@JsonIgnore
	private ConcurrentHashMap<String, ConcurrentHashMap<String, JsonObject>> preparedDataSet = new ConcurrentHashMap<>();

	public void addPreparedData(PreparedData preparedData) {
		if (preparedDataSet.containsKey(preparedData.getMid())) {
			preparedDataSet.get(preparedData.getMid()).put(preparedData.getFid(), JsonUtil.toJsonObject(preparedData.getData()));
		} else {
			ConcurrentHashMap<String, JsonObject> modelDataSet = new ConcurrentHashMap<>();
			modelDataSet.put(preparedData.getFid(), JsonUtil.toJsonObject(preparedData.getData()));
			preparedDataSet.put(preparedData.getMid(), modelDataSet);
		}
	}
	
	public void addPreparedDatas(List<PreparedData> preparedDatas) {
		for (PreparedData preparedData : preparedDatas) {
			addPreparedData(preparedData);
		}
	}

	public boolean hasPreparedData(String mid, String fid) {
		
		System.out.println("HHOOONNNKKIII " + mid + fid);
		
		return preparedDataSet.containsKey(mid) && preparedDataSet.get(mid).containsKey(fid);
	}

	public ConcurrentHashMap<String, JsonObject> getModelPreparedDataSet(String mid) {
		return preparedDataSet.get(mid);
	}

	public JsonObject getFunctionPreparedDataObject(String mid, String fid) {
		JsonObject jsonObject = getModelPreparedDataSet(mid).get(fid);
		System.out.println("HHOOONNNKKIII " + jsonObject);
		return jsonObject;
	}

}
