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

package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Transient;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
@IdClass(value=BrtcDeployModelPk.class)
public class BrtcDeployModel implements Serializable {

	@Id
	@Column(nullable=false)
	private String deployId;

	@Id
	@Column(nullable=false)
	@NotEmpty
	private String registerUserId;
	
	@Id
	@Column(nullable=false)
	private String version;
	
	private String projectName;
	
	private String modelName;
	
	private String title;

	@Column(columnDefinition="text")
	private String description;
	
	@Column(columnDefinition="text")
	private String contents;
	
	@Column(columnDefinition="text")
	private String runnableContents;
	
	@Column(length=10, nullable=false)
	@ColumnDefault("'N'")
	private String gvYn;
	
	@Column(length=10, nullable=false)
	@ColumnDefault("'Y'")
	private String isactive;

	private String sourceServer;
	
	private String deployTime;
	
	private String updateUserId;
	
	private String updateTime;

	@Transient
	private String projectId;
	@Transient
	private String modelId;
	
	public void setProjectId(String projectId){
		this.projectId = projectId;
		this.projectName = projectId;
	}

	public void setModelId(String modelId){
		this.modelId = modelId;
		this.modelName = modelId;
	}

}
