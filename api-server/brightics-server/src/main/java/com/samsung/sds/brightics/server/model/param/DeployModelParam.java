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

package com.samsung.sds.brightics.server.model.param;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper=false)
public class DeployModelParam{
	
	//Get from client
	private String projectId;
	private String modelId;
	
	
	//use to DB
	private String deployId;

	@NotEmpty
	private String registerUserId;
	
	private String version;
	
	private String projectName;
	
	private String modelName;
	
	private String title;
	
	private String description;
	
	private String contents;
	
	private String runnableContents;
	
	private String gvYn;
	
	private String isactive;

	private String sourceServer;
	
	private String deployTime;

	private String updateUserId;
	
	private String updateTime;

}