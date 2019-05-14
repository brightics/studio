package com.samsung.sds.brightics.common.workflow.flowrunner.vo;

import java.util.Map;

import lombok.Data;

@Data
public class PreparedDataVO {

	private String mid;
	private String fid;
	private String tid;
	private Map<String, Object> data;

}
