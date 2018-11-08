package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
@SuppressWarnings("serial")
public class BrtcJobModel implements Serializable {
	
	@Id
	private String modelId;

	private String modelType;
	
	@Column(columnDefinition="text")
	private String contents;
	
	@Column(columnDefinition="text")
	private String variables;
	
	private String modifyTime;

	private String main;
	
}
