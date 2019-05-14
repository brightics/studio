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

package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.workflow.flowrunner.variable.LegacyVariableConverter;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;

public class ModelComplementer {

	private static final Logger logger = LoggerFactory.getLogger(ModelComplementer.class);
	
	private static JsonObject modelFunctions = new JsonObject();
	
	public static void complementModel(String mid, JsonObject model, JobParam jobParam) {
		model.addProperty("mid", mid);

		if (model.has("innerModels")) {
			for (Entry<String, JsonElement> innerModel : model.getAsJsonObject("innerModels").entrySet()) {
				complementModel(innerModel.getKey(), innerModel.getValue().getAsJsonObject(), jobParam);
			}
		}

		if (!model.has("variables")) {
			model.add("variables", new JsonObject());
		}

		model.addProperty("user", jobParam.getUser());

		if (jobParam.isConverted()) {
			// complement calculated variables for legacy job json
			new LegacyVariableConverter().convertCalculationVariable(model);
		}

		if (model.has("functions")) {
			complementFunction(model.getAsJsonArray("functions"));
		}

		if (model.has("optModels")) {
			complementOptModels(model);
		}
	}
	

	private static void complementFunction(JsonArray functions) {
		for (JsonElement function : functions) {
			JsonObject functionObject = function.getAsJsonObject();
			if (!functionObject.has("name")) {
				logger.error("[FIXME] name property is missing in function {}.", functionObject.get("operation"));
				functionObject.add("name", functionObject.get("operation"));
			}

			if (functionObject.has("param") && functionObject.getAsJsonObject("param").has("functions")) {
				complementFunction(functionObject.getAsJsonObject("param").getAsJsonArray("functions"));
			}
			// add all function in modelFunctions map.
			modelFunctions.add(functionObject.getAsJsonPrimitive("fid").getAsString(), functionObject);
		}
	}

	private static void complementOptModels(JsonObject model) {
		for (Entry<String, JsonElement> optModel : model.getAsJsonObject("optModels").entrySet()) {
			JsonObject optModelObject = optModel.getValue().getAsJsonObject();

			// create opt variable. and bind variable to function.
			initOptVariablesAndBind(optModelObject);

			// create opt functions.
			copyModelFunctionsToOptFunctions(optModelObject);
		}
	}

	private static void copyModelFunctionsToOptFunctions(JsonObject optModelObject) {
		JsonArray functionsArray = new JsonArray();
		if (optModelObject.has("functions")) {
			for (JsonElement function : optModelObject.getAsJsonArray("functions")) {
				JsonObject functionObject = function.getAsJsonObject();
				if (modelFunctions.has(functionObject.get("fid").getAsString())) {
					functionsArray
							.add(modelFunctions.getAsJsonObject(functionObject.get("fid").getAsString()).deepCopy());
				}
			}
		}
		optModelObject.add("functions", functionsArray);
	}

	private static final String OPT_VARIABLE_PREFIX = "opt";

	private static void initOptVariablesAndBind(JsonObject optModelObject) {
		JsonObject optVariables = new JsonObject();
		if (optModelObject.has("optSelected")) {
			for (Entry<String, JsonElement> optFunction : optModelObject.getAsJsonObject("optSelected").entrySet()) {
				String fid = optFunction.getKey();
				JsonObject optFunctionObject = optFunction.getValue().getAsJsonObject();
				if (modelFunctions.has(fid)) {
					JsonObject functionObject = modelFunctions.getAsJsonObject(fid);
					if (functionObject.has("param") && functionObject.get("fid").getAsString().equals(fid)
							&& optFunctionObject.has("optParam")) {
						for (Entry<String, JsonElement> optParamEm : optFunctionObject.getAsJsonObject("optParam")
								.entrySet()) {
							String paramName = optParamEm.getKey();
							String optVariable = OPT_VARIABLE_PREFIX + IdGenerator.getSimpleId();

							// if (functionObject.getAsJsonObject("param").has(paramName)) {
							functionObject.getAsJsonObject("param").addProperty(paramName,
									String.format("${=%s}", optVariable));
							JsonObject paramInfo = optParamEm.getValue().getAsJsonObject();
							paramInfo.addProperty("fid", fid);
							paramInfo.addProperty("paramName", paramName);
							optVariables.add(optVariable, paramInfo);
							// }
						}
					}
				}
			}
			optModelObject.remove("optSelected");
		}
		optModelObject.add("optVariables", optVariables);
	}
	
}
