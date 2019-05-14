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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.util.JsonUtil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class JobParam {

	private String user;

	private String jid;

	private String main = StringUtils.EMPTY;

	private String duration;

	@Deprecated
	private Map<String, Object> args;

	private Map<String, Map<String, Object>> models;

	private String version;

	private boolean converted = false;

	private List<PreparedDataVO> datas = new ArrayList<>();

	public void overrideVariables(JsonObject variables) {
		if (variables == null || variables.size() < 1) {
			return;
		}
		Map<String, Object> main = this.models.get(this.main);
		if (!main.containsKey("variables")) {
			main.put("variables", new JsonObject());
		}

		JsonObject mainVariables = JsonUtil.toJsonObject(main.get("variables"));
		for (Entry<String, JsonElement> variable : variables.entrySet()) {
			String name = variable.getKey().replace("^\\${", "").replace("}$", "").replaceAll("[-]", "");
			if (mainVariables.has(name)) {
				mainVariables.getAsJsonObject(name).add("value", convertValue(variable.getValue()));
			}
		}
		main.put("variables", mainVariables);
	}

	private JsonElement convertValue(JsonElement value) {
		if (value.isJsonPrimitive()) {
			return value.getAsJsonPrimitive().isString() ? new JsonPrimitive(convertValue(value.getAsString())) : value;
		} else if (value.isJsonArray()) {
			JsonArray result = new JsonArray();
			for (JsonElement element : value.getAsJsonArray()) {
				result.add(convertValue(element));
			}
			return result;
		} else if (value.isJsonObject()) {
			JsonObject result = new JsonObject();
			for (Entry<String, JsonElement> entry : value.getAsJsonObject().entrySet()) {
				result.add(entry.getKey(), convertValue(entry.getValue()));
			}
		} else if (value.isJsonNull()) {
			return JsonNull.INSTANCE;
		}
		throw new IllegalArgumentException("{} is not supported json type");
	}

	private final Pattern OLD_EXPR = Pattern.compile("\\$\\{([^}]+)}");

	private String convertValue(String value) {
		Matcher m = OLD_EXPR.matcher(value);
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			String target = m.group(1);
			sb.append("${=").append(target.replaceAll("[-]", "")).append("}");
		}
		m.appendTail(sb);
		return sb.toString();
	}
	
	
}
