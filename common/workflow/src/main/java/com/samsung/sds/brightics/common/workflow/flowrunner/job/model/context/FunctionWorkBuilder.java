package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.context;

import java.util.LinkedList;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl.FunctionWork;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl.SetDataFunction;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl.SetValueFunction;

class FunctionWorkBuilder {

	private final JsonObject functionInfo;
	private final LinkedList<Node> functionList = new LinkedList<>();

	FunctionWorkBuilder(JsonObject function) {
		this.functionInfo = function;
	}

	Node build() {
		if ("SetValue".equals(JsonObjectUtil.getAsString(functionInfo, "name"))) {
			return new SetValueFunction(functionInfo);
		} else if (isbuildSetDataFunction(functionInfo)) {
			return new SetDataFunction(functionInfo);
		} else {
			return buildFunctionWork(functionInfo);
		}
	}

	private boolean isbuildSetDataFunction(JsonObject functionInfoForCheck) {
		String mid = JobContextHolder.getJobStatusTracker().getCurrentModelMid();
		if (functionInfoForCheck.has("external") && functionInfoForCheck.get("external").getAsBoolean()
				&& JobContextHolder.getPreparedDataSet().hasPreparedData(mid,
						JsonObjectUtil.getAsString(functionInfoForCheck, "fid"))) {
			return true;
		}
		return false;
	}

	private Node buildFunctionWork(JsonObject funcInfo) {
		processSubflow(funcInfo);
		Workflow result = new SequentialWorkflow(JsonObjectUtil.getAsString(funcInfo, "fid"),
				new ParametersBuilder().build());
		for (Node node : functionList) {
			result.addNode(node);
		}
		return result;
	}

	private void processSubflow(JsonObject funcInfo) {
		if ("Subflow".equals(JsonObjectUtil.getAsString(funcInfo, "name"))) {
			JsonArray subFunctions = funcInfo.getAsJsonObject("param").getAsJsonArray("functions");
			subFunctions.forEach((JsonElement subFunction) -> {
				JsonObject subFunctionInfo = subFunction.getAsJsonObject();
				Node subFunctionNode;
				if ("SetValue".equals(JsonObjectUtil.getAsString(subFunctionInfo, "name"))) {
					subFunctionNode = new SetValueFunction(subFunctionInfo);
				} else if (isbuildSetDataFunction(subFunctionInfo)) {
					subFunctionNode = new SetDataFunction(subFunctionInfo);
				} else {
					subFunctionNode = new FunctionWork(subFunctionInfo);
				}
				if (!functionList.isEmpty()) {
					functionList.peekLast().connect(subFunctionNode);
				}
				functionList.add(subFunctionNode);
			});
		} else {
			functionList.add(new FunctionWork(funcInfo));
		}
	}
}
