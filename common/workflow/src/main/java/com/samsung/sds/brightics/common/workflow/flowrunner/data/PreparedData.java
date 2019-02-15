package com.samsung.sds.brightics.common.workflow.flowrunner.data;

import java.util.Map;

import lombok.Data;

@Data
public class PreparedData {

	private String mid;
	private String fid;
	private String tid; 
	private Map<String, Object> data;

}
