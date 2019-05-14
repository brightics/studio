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
