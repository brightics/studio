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
		SQL, 		// Distribute JDBC loader.
		SCRIPT, 	// UDF.
		DATASOURCE, // Read from DB.
		S3, 		// Read from S3.
		PYFUNCTION, // Python function like AD.
		DLPREDICT;	// Deeplearning predict.
	}
}

