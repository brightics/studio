package com.samsung.sds.brightics.server.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.io.CharStreams;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.server.model.param.FunctionMetaParam;

public class FunctionPropertiesUtil {

	private static final Logger logger = LoggerFactory.getLogger(FunctionPropertiesUtil.class);

	private static Map<String, FunctionMetaParam> functionMetaMap;
	private static Map<String, String> functionHelpMap;
	private static Map<String, String> functionLabelMap;

	private static final String FUNCTION_FOLDER = "function";
	private static final String FUNC = "func";
	private static final String NAME = "name";
	private static final String PARAMS = "params";
	private static final String PARAM_ID = "id";
	private static final String PARAM_LABEL = "label";

	public static void initFunctionProperties() {
		// load function
		logger.info("initialize function properties.");

		functionMetaMap = new HashMap<>();
		functionHelpMap = new HashMap<>();
		functionLabelMap = new HashMap<>();
		try {
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			File functionFolder = new File(classLoader.getResource(FUNCTION_FOLDER).getFile());
			for (File functonContextFolder : functionFolder.listFiles()) {
				String context = functonContextFolder.getName(); // spark or
																	// python
				Files.find(functonContextFolder.toPath(), 5,
						(path, basicFileAttributes) -> path.toFile().getName().matches(".*.json")
								|| path.toFile().getName().matches(".*.md"))
						.forEach(path -> setFucntionProperties(context, path));
			}
		} catch (Exception e) {
			logger.error("Cannot initialize function properties.", e);
		}
	}

	private static void setFucntionProperties(String context, Path path) {
		File functionHelpFile = path.toFile();
		String filename = functionHelpFile.getName();
		if (path.toFile().getName().matches(".*.json")) {
			try {
				FunctionMetaParam functionMetaParam = JsonUtil.fromJson(new FileInputStream(functionHelpFile),
						FunctionMetaParam.class);
				Map<String, Object> specJson = functionMetaParam.getSpecJson();
				setFunctionLabelInfo(specJson);
				functionMetaMap.put(String.valueOf(specJson.get(FUNC)), functionMetaParam);
			} catch (Exception e) {
				logger.error("Cannot initialize function meta json. file name : " + filename, e);
			}
		} else {
			try {
				if (StringUtils.isNoneBlank(filename)) {
					String contents = null;
					try (final Reader reader = new InputStreamReader(new FileInputStream(functionHelpFile))) {
						contents = CharStreams.toString(reader);
					}
					functionHelpMap.put(filename, contents);
				}
			} catch (Exception e) {
				logger.error("Cannot initialize function help. file name : " + filename, e);
			}
		}
	}
	
	public static void refreshFunctionProperties(){
		initFunctionProperties();
	}

	public static Object getFunctionMeta(String func) {
		if (functionMetaMap == null) {
			initFunctionProperties();
		}
		return functionMetaMap.get(func);
	}

	public static Object getFunctionMetaList() {
		if (functionMetaMap == null) {
			initFunctionProperties();
		}
		return functionMetaMap;
	}

	public static Object getFunctionHelpList() {
		if (functionHelpMap == null) {
			initFunctionProperties();
		}
		return functionHelpMap;
	}

	public static Object getFunctionHelp(String name) {
		if (functionHelpMap == null) {
			initFunctionProperties();
		}
		return functionHelpMap.get(name);
	}

	public static Object getFunctionLabelList() {
		if (functionLabelMap == null) {
			initFunctionProperties();
		}
		return functionLabelMap;
	}

	public static String getFunctionLabel(String functionName, String parameter) {
		if (functionLabelMap == null) {
			initFunctionProperties();
		}
		return functionLabelMap.getOrDefault(getFunctionLabelKey(functionName, parameter), parameter);
	}

	@SuppressWarnings("unchecked")
	private static void setFunctionLabelInfo(Map<String, Object> specJson) {
		String name = String.valueOf(specJson.get(NAME));
		List<Object> params = (List<Object>) specJson.get(PARAMS);
		for (Object param : params) {
			Map<String, Object> paramMap = (Map<String, Object>) param;
			functionLabelMap.put(getFunctionLabelKey(name, String.valueOf(paramMap.get(PARAM_ID))),
					String.valueOf(paramMap.get(PARAM_LABEL)));
		}
	}

	private static String getFunctionLabelKey(String functionName, String parameter) {
		return functionName + "." + parameter;
	}

}
