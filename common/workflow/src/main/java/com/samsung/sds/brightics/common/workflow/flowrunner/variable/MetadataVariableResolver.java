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
