package com.samsung.sds.brightics.server.model.vo;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
public class ExceptionInfoVO {

	private String message;
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String detailMessage;

	public ExceptionInfoVO(String message) {
		this.message = message;
	}

	public ExceptionInfoVO(String message, String detailMessage) {
		this.message = message;
		if(StringUtils.isNoneBlank(detailMessage)) {
			this.detailMessage = detailMessage;
		}
	}
}
