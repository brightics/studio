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

package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.annotations.JSFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.JobStatusTracker;

public class WorkflowJsAPI extends ScriptableObject {

	private static final Logger LOGGER = LoggerFactory.getLogger(WorkflowJsAPI.class);

	@Override
	public String getClassName() {
		return WorkflowJsAPI.class.getSimpleName();
	}

	/**
	 * Loads filePath to temporary table and read cell data by rowNumber and
	 * columnName
	 *
	 * @param filePath
	 *            fie path to load
	 * @param rowNumber
	 *            1-based row number
	 * @param columnName
	 *            column name
	 */
	@JSFunction
	public synchronized Object uploadDataAndGetCellValue(String filePath, int rowNumber, String columnName) {
		try {
			String tableName = generateTableName(filePath);

			// outputs
			Map<String, String> outputs = new HashMap<>();
			outputs.put("table", tableName);

			// table load with filePath
			Map<String, Object> loadParams = new HashMap<>();
			loadParams.put("path", filePath);

			// attributes
			Map<String, Object> loadAttrs = new HashMap<>();
			loadAttrs.put("mid", JobContextHolder.getJobStatusTracker().getCurrentModelMid());
			loadAttrs.put("label", "CellFunction-Load");
			loadAttrs.put("outputs", outputs);
			loadAttrs.put("persist", false);
			loadAttrs.put("context", "python");

			String loadTaskId = IdGenerator.getSimpleId();
			LoggerUtil.pushMDC("taskId", loadTaskId);
			runTaskFunction(loadTaskId, "brightics.function.io$read_parquet_or_csv", JsonUtil.toJson(loadParams),
					JsonUtil.toJson(loadAttrs));
			// execute SQL
			return getCellValue(tableName, columnName, rowNumber);
		} catch (Exception e) {
			LOGGER.error("[WORKFLOW.JS ERROR]", e);
			throw e;
		}
	}

	/**
	 * Generates table name using hash value of current mid and filePath.
	 *
	 * @param filePath
	 *            file path
	 * @return table name
	 */
	private String generateTableName(String filePath) {
		JobStatusTracker jobStatusTracker = JobContextHolder.getJobStatusTracker();
		return "t" + String.format("%08X", Objects.hash(jobStatusTracker.getCurrentModelMid(), filePath));
	}

	/**
	 * Reads cell data by tableName, columnName, and rowNumber
	 *
	 * @param tableName
	 *            table name
	 * @param columnName
	 *            column name
	 * @param rowNumber
	 *            1-based row number
	 */
	@JSFunction
	public synchronized Object getCellValue(String tableName, String columnName, int rowNumber) {
		String dataKey = buildDataKey(JobContextHolder.getJobStatusTracker().getCurrentModelMid(), tableName);
		Object result = JobContextHolder.getJobRunnerAPI().getData(dataKey, rowNumber - 1, rowNumber);

		JsonObject table = Optional.ofNullable(JsonUtil.jsonToObject(result.toString()))
				.orElseThrow(() -> new BrighticsCoreException("3102", "no data")).getAsJsonObject("data");

		Object cellValue = extractColumnValue(table, columnName);
		LOGGER.info("[WORKFLOW.JS] cell : {}", cellValue);
		return cellValue;
	}
	
	private String buildDataKey(String mid, String tid) {
        String user = JobContextHolder.getJobStatusTracker().getJobStatus().getUser();
        return Stream.of(user, mid, tid).collect(Collectors.joining("/", "/", ""));
    }

	private Object extractColumnValue(JsonObject table, String columnName) {
		if (table.getAsJsonArray("data").size() <= 0) {
			throw new BrighticsCoreException("3102", "no data");
		}

		JsonArray schema = table.getAsJsonArray("schema");
		int columnIdx = -1;
		for (int idx = 0; idx < schema.size(); idx++) {
			if (columnName.equals(schema.get(idx).getAsJsonObject().get("column-name").getAsString())) {
				columnIdx = idx;
				break;
			}
		}

		if (columnIdx < 0) {
			throw new BrighticsCoreException("3102", "Invalid column name(" + columnName + ")");
		}

		JsonArray firstRow = table.getAsJsonArray("data").get(0).getAsJsonArray();
		return JsonElementScriptableConverter.convert(firstRow.get(columnIdx));
	}

	private void runTaskFunction(String taskId, String name, String parameters, String attributes) {
		if (name.equals("sql")) {
			LoggerUtil.pushMDC("cellTask", "execute sql");
		} else {
			LoggerUtil.pushMDC("cellTask", "load filePath");
		}

		try {
			LOGGER.info("[WORKFLOW.JS TASK START]");
			Object result = JobContextHolder.getJobRunnerAPI().executeTaskAndGetResult(taskId,
					JobContextHolder.getJobStatusTracker().getJobStatus().getUser(), name, parameters, attributes);
			LOGGER.info("[WORKFLOW.JS TASK SUCCESS] result: {}", result);
		} catch (InterruptedException e) {
			LOGGER.error("[WORKFLOW.JS TASK INTERRUPTED]", e);
			Map<String, Object> attributesMap = JsonUtil.jsonToMap(attributes);
			String context = attributesMap.getOrDefault("context", "").toString();
			JobContextHolder.getJobRunnerAPI().stopTask(taskId, name, context);
			throw new BrighticsCoreException("3101");
		} catch (AbsBrighticsException e) {
			LOGGER.error("[WORKFLOW.JS TASK ERROR] {}", e.getMessage());
			throw e;
		} finally {
			LoggerUtil.popMDC("cellTask");
			LoggerUtil.popMDC("taskId");
		}
	}
}
