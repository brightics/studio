package com.samsung.sds.brightics.server.model.param;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FunctionMetaParam {

	private Map<String, Object> script;
	private Map<String, Object> specJson;
	private Object md;

}
