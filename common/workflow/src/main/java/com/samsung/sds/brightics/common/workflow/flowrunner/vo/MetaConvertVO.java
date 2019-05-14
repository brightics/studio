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

