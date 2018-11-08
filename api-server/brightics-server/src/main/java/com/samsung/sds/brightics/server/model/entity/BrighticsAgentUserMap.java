package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
public class BrighticsAgentUserMap implements Serializable {

	@Id
	String userId;
	
	String agentId;
	
}
