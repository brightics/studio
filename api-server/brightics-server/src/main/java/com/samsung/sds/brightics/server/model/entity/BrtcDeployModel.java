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
