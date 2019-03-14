package com.samsung.sds.brightics.common.workflow.flowrunner.vo;

import com.google.gson.JsonObject;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class MetaConvertVO {
	
	public MetaConvertType metadata;
	public JsonObject jsonObject; 
	
	public enum MetaConvertType {
		SQL,
		SCRIPT, 
		DATASOURCE,
		S3,
		PYFUNCTION,
		DLPREDICT;
	}
}

