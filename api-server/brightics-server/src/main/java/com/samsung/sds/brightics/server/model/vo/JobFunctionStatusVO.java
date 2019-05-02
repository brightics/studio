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

package com.samsung.sds.brightics.server.model.vo;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper=false)
public class JobFunctionStatusVO {

	@JsonIgnore
	private String mid; 
	@JsonInclude(JsonInclude.Include.NON_NULL) 
	private String pid; 

	private String fid;
	private String label;
	private String taskId;
	private String status;
	private long begin;
	private long end;
	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String message;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Object optimization ;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String count;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String bytes;

	@JsonIgnore
	private String functionName;

	public void setBegin(long begin) {
		this.begin = begin;
		this.end = -1;
	}
	public void setEnd(long end) {
		if (this.begin == -1) this.begin = end;
		this.end = end;
	}
}
