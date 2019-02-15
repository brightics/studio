package com.samsung.sds.brightics.common.workflow.flowrunner.vo;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
public class JobErrorVO {

	private String message;
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String detailMessage;

	public JobErrorVO(String message) {
		this.message = message;
	}

	public JobErrorVO(String message, String detailMessage) {
		this.message = message;
		if(StringUtils.isNoneBlank(detailMessage)) {
			this.detailMessage = detailMessage;
		}
	}
}
