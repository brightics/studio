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