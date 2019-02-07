package com.samsung.sds.brightics.common.workflow.runner.util.opt;

import java.util.Map;
import java.util.Map.Entry;
import java.util.StringJoiner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class OptScriptUtil {

	private static final String LINE_SEPARATOR = System
			.getProperty("line.separator");

	public static String tryToGetString(JsonObject jsonObj, String key) {
		if (jsonObj.has(key))
			return ", " + key + " = " + jsonObj.get(key).getAsString();
		return "";
	}

	public static String tryToGetArray(JsonObject jsonObj, String key) {
		if (jsonObj.has(key))
			return ", set_values = "
					+ jsonObj.get(key).getAsJsonArray().toString();
		return "";
	}

	public static String createBroptJob(String optJobId,
			Map<String, JsonElement> optVariables, String objectiveSense,
			JsonElement constraints, String method, String maxIterations,
			String maxEvaluations) {

		StringJoiner script = new StringJoiner(LINE_SEPARATOR);
		script.add("import math");
		script.add("import json");
		script.add("from bropt import BroptJOB, EXECUTE_MODE, Property");
		script.add("from bropt.engine.objects import Matrix, JobResult, Parameter, Objective, Constraint, METHOD, GRADIENT, HESSIAN");
		script.add("job_id = str(\"" + optJobId + "\")");
		script.add("job_info = BroptJOB().create(");
		script.add("	id=job_id,");
		script.add("	method={        ");
		script.add("		Property.METHOD_NAME: METHOD.METHOD_NAME." + method);
		script.add("		, Property.MAX_ITERATIONS: " + maxIterations);
		script.add("		, Property.MAX_EVALUATIONS: " + maxEvaluations);
		script.add("		, Property.SEED: " + 123);
		script.add("	},");
		script.add("    parameters=[");
		for (Entry<String, JsonElement> optVariable : optVariables.entrySet()) {
			String name = optVariable.getKey();
			JsonObject optValue = optVariable.getValue().getAsJsonObject();
			String value = optValue.get("value").getAsString();

			String min = tryToGetString(optValue, "min");
			String max = tryToGetString(optValue, "max");
			String setValues = tryToGetArray(optValue, "set");

			String type = "CONTINUOUS";
			if (optValue.get("type") != null) {
				type = optValue.get("type").getAsString();
			}

			script.add(String.format("		Parameter(name= '%s', init= %s" + min
					+ max + setValues + ", type=Parameter.TYPE.%s),", name,
					value, type));

		}
		script.add("	],");
		script.add("    objectives=[");
		script.add("		Objective(name='f', sense=Objective.SENSE."
				+ objectiveSense.toUpperCase() + ")");
		script.add("	],");
		script.add("    constraints=[");
		// TODO add constraints
		// script.add("		Constraint(name='c1', type=Constraint.TYPE.INEQUALITY, min=-50, max=0)");
		// script.add("		, Constraint(name='c2', type=Constraint.TYPE.EQUALITY, target=0)");
		script.add("	],");
		script.add("    gradient={");
		script.add("		Property.GRADIENT_TYPE: GRADIENT.GRADIENT_TYPE.NO_GRADIENT");
		script.add("	},");
		script.add("    hessian={");
		script.add("		Property.HESSIAN_TYPE: HESSIAN.HESSIAN_TYPE.NO_HESSIAN");
		script.add("	}");
		script.add(")");

		return script.toString();
	}

	public static String updateBroptJob(String optJobId, String computedValue) {
		StringJoiner script = new StringJoiner(LINE_SEPARATOR);
		script.add("job_id = str(\"" + optJobId + "\")");
		script.add("vars = BroptJOB(job_id).evaluation(EXECUTE_MODE.NORMAL).create()");
		script.add("BroptJOB(job_id).evaluation(EXECUTE_MODE.NORMAL).update(objects={'f':"
				+ computedValue + "})");
		script.add("json.dumps(vars)");
		return script.toString();
	}

	public static String isCompleteBroptJob(String optJobId) {
		StringJoiner script = new StringJoiner(LINE_SEPARATOR);
		script.add("job_id = str(\"" + optJobId + "\")");
		script.add("BroptJOB(job_id).is_completed()");
		return script.toString();
	}

	public static String getBestParameterBroptJob(String optJobId) {
		StringJoiner script = new StringJoiner(LINE_SEPARATOR);
		script.add("job_id = str(\"" + optJobId + "\")");
		script.add("result = BroptJOB(job_id).read()");
		script.add("result.data.best_data[0][\"parameters\"]");
		return script.toString();
	}

}
