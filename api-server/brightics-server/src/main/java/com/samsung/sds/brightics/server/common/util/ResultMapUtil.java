package com.samsung.sds.brightics.server.common.util;

import java.util.HashMap;
import java.util.Map;

public class ResultMapUtil {

	public static Map<String, Object> resultMap(String key, Object result, String message) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("message", message);
		map.put(key, result);
		return map;
	}

	public static Map<String, Object> resultMap(String key, Object result) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(key, result);
		return map;
	}
	
	public static Map<String, Object> success(String key, Object result) {
		return resultMap(key, result);
	}
	
	public static Map<String, Object> success(Object result) {
		return resultMap("result", result);
	}

	public static Map<String, Object> successAddMessage(Object result, String message) {
		return resultMap("result", result, message);
	}

}
