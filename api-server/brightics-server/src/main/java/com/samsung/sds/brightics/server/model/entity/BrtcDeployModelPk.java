package com.samsung.sds.brightics.server.model.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("serial")
public class BrtcDeployModelPk implements Serializable {
	private String deployId;
	private String registerUserId;
	private String version;
}
