package com.samsung.sds.brightics.common.workflow.runner.vo;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class JobParam {

	private String user;

	private String jid;

	private String main;

	private String duration;

	@Deprecated
	private Map<String, Object> args;

	private Map<String, Map<String, Object>> models;

	private String version;

	private boolean converted = false;
}
