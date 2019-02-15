package com.samsung.sds.brightics.common.workflow.flowrunner.vo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper=false)
public class JobModelStatusVO {
	private String pid;
	private String mid;
	private String status;
	private long begin;
	private long end;
	
	@JsonInclude(JsonInclude.Include.NON_NULL) 
	private List<JobFunctionStatusVO> functions;

	public List<JobFunctionStatusVO> getFunctions() {
		if (functions == null) {
			functions = new ArrayList<>();
		}
		return functions;
	}

	public void setBegin(long begin) {
		this.begin = begin;
		this.end = -1;
	}
	public void setEnd(long end) {
		if (this.begin == -1) this.begin = end;
		this.end = end;
	}
}
