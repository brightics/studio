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

package com.samsung.sds.brightics.common.workflow.flowrunner.variable;

import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO.MetaConvertType;

public class MetadataVariableResolver implements IVariableResolver {
    
	public static final String METADATA_KEY = "metadata";

    @Override
	public JsonElement resolve(JsonElement elem) {
		// 1. Make sure this JsonElement represents metadata.
		if (elem != null && elem.isJsonObject()) {
			JsonObject jsonObject = elem.getAsJsonObject();
			// 2. Change the elem. Applying functions for the metadata repositories.
			if (isMetadataRequest(jsonObject)) {
				return JobContextHolder.getJobRunnerAPI().convert(new MetaConvertVO(
						EnumUtils.getEnum(MetaConvertType.class, StringUtils.upperCase(jsonObject.get(METADATA_KEY).getAsString())), jsonObject));
			} else {
				return elem;
			}
		} else {
			// don't touch anything.
			return elem;
		}
	}
    
	private boolean isMetadataRequest(JsonObject jsonObject) {
		return jsonObject.has(METADATA_KEY) && EnumUtils.isValidEnum(MetaConvertType.class,
				StringUtils.upperCase(jsonObject.get(METADATA_KEY).getAsString()));
	}

    
}
