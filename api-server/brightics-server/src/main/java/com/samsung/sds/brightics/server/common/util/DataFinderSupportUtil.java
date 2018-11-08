package com.samsung.sds.brightics.server.common.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

/**
 * This class support DataFinder project 
 * combine main query (rough main query + select condition info) 
 */
public class DataFinderSupportUtil {
	
	static final String FROM 	= "from";
	static final String TO 		= "to";
	static final String LINE 	= "line";
	static final String BY 		= "by";
	static final String QUOTATION 		= "\'";
	static final String EMPTY_QUOTATION = "''";

	public static String combineMainQuery(String roughQuery, Map<String, Object> funcParams, Map<String, Object> conditionMap) {
		String from = String.valueOf(funcParams.get(FROM));
		String to = String.valueOf(funcParams.get(TO));
		Object line = funcParams.get(LINE);

		int paramLen = conditionMap.size() + 3;
		String[] keyArray = new String[paramLen];
		String[] valueArray = new String[paramLen];
		keyArray[0] = mainQueryParamKeyMapper(FROM);
		valueArray[0] = QUOTATION + from + QUOTATION;
		keyArray[1] = mainQueryParamKeyMapper(TO);
		valueArray[1] = QUOTATION + to + QUOTATION;
		keyArray[2] = mainQueryParamKeyMapper(LINE);
		valueArray[2] = sqlParameterCreater(line);
		Set<String> keySet = conditionMap.keySet();
		int index = 3;
		for (String paramKey : keySet) {
			if (!BY.equals(paramKey)) {
				Object paramVal = conditionMap.get(paramKey);
				String paramValString = sqlParameterCreater(paramVal);
				keyArray[index] = mainQueryParamKeyMapper(paramKey);
				valueArray[index] = paramValString;
				index++;
			}
		}

		return StringUtils.replaceEach(roughQuery, keyArray, valueArray);
	}
	
	@SuppressWarnings("rawtypes")
	public static String sqlParameterCreater(Object paramVal) {
		String addValue = "";
		if (paramVal instanceof List) {
			if (((List) paramVal).size() == 0) {
				return EMPTY_QUOTATION;
			} else {
				for (Object val : (List) paramVal) {
					String stringValue = String.valueOf(val);
					addValue += QUOTATION + stringValue + QUOTATION +" ,";
				}
			}
		} else if (paramVal instanceof String[]) {
			if (((String[]) paramVal).length == 0) {
				return EMPTY_QUOTATION;
			} else {
				for (Object val : (String[]) paramVal) {
					String stringValue = String.valueOf(val);
					addValue += QUOTATION + stringValue + QUOTATION +" ,";
				}
			}
		} else {
			String stringValue = String.valueOf(paramVal);
			addValue = QUOTATION + stringValue + QUOTATION + " ,";
		}
		return addValue.substring(0, addValue.length() - 1);
	}

	public static String mainQueryParamKeyMapper(String originKey) {
		Map<String, String> keyMap = new HashMap<>();
		keyMap.put("line", "$LINE_ID");
		keyMap.put("from", "$FROM");
		keyMap.put("to", "$TO");
		keyMap.put("site", "$SITE");
		keyMap.put("by", "$BY");
		keyMap.put("area", "$AREA");
		keyMap.put("eqpModel", "$EQP_MODEL");
		keyMap.put("eqpType", "$EQP_TYPE");
		keyMap.put("eqpId", "$EQP_ID");
		keyMap.put("floorId", "$FLOOR_ID");
		keyMap.put("processId", "$PROCESS_ID");
		keyMap.put("stepSeq", "$STEP_SEQ");
		keyMap.put("stepId", "$STEP_ID");
		keyMap.put("rootLotId", "$ROOT_LOT_ID");
		keyMap.put("paramName", "$PARAM_NAME");
		keyMap.put("eqp", "$EQP");
		keyMap.put("lot", "$LOT");
		keyMap.put("ppid", "$PPID");
		keyMap.put("priority", "$PRIORITY");
		keyMap.put("dataClass", "$DATA_CLASS");
		keyMap.put("itemGroup", "$ITEM_GROUP");
		keyMap.put("itemType", "$ITEM_TYPE");
		keyMap.put("itemId", "$ITEM_ID");
		keyMap.put("subItemId", "$SUB_ITEM_ID");
		keyMap.put("zoneId", "$ZONE_ID");
		keyMap.put("zoneType", "$ZONE_TYPE");
		keyMap.put("dcopId", "$DCOP_ID");
		return keyMap.get(originKey);
	}

}
