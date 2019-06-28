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

package com.samsung.sds.brightics.common.core.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * For v3.6 function exception handling
 * A function exception has multiple errors.
 * also, parameters and label information must be managed at the same time. 
 * 
 * @author hk.Im
 */
public class BrighticsFunctionException extends AbsBrighticsException {

	private static final long serialVersionUID = 1L;

	public List<BrighticsErrorVO> brtcErrors = new ArrayList<>();
	public String functionName;
	public boolean isParsing = false;
	
	public static class BrighticsErrorVO {
		public String code;
		public String[] params;
		public BrighticsErrorVO(String code, String[] params){
			this.code = code;
			this.params = params;
		}
	}

	/**
	 * @param code  : set just error code number. ex) 0001
	 */
	public BrighticsFunctionException(String code) {
		this.brtcErrors.add(new BrighticsErrorVO("FN"+ HYPHEN + code, ArrayUtils.EMPTY_STRING_ARRAY));
	}

	/**
	 * @param code  : set just error code number. ex) 0001
	 * @param params : exception message parameters. ex) {column, in-data}
	 */
	public BrighticsFunctionException(String code, String[] params) {
		this.brtcErrors.add(new BrighticsErrorVO("FN"+ HYPHEN + code, params));
	}
	
	/**
	 * @param errors : code, parameter error set list.
	 */
	public BrighticsFunctionException(List<Map<String, String[]>> errors) {
		for (Map<String, String[]> error : errors) {
			for (String code : error.keySet()) {
				this.brtcErrors.add(new BrighticsErrorVO("FN"+ HYPHEN + code, error.get(code)));
			}
		}
	}

	@Override
	public String getMessage() {
		return StringUtils.join(brtcErrors.stream()
				.map(error -> convertMessage(error.code, error.params)).toArray(), ", ");
	}

	/**
	 * For brightics function parameter parsing to label.
	 * If isPasing is true and functionName is not null, change the error parameter to label.
	 * @param functionName : label changed function name.
	 * @return
	 */
	public BrighticsFunctionException setTagFunction(String functionName) {
		this.functionName = functionName;
		for (BrighticsErrorVO brighticsErrorVO : brtcErrors) {
			if(brighticsErrorVO.params.length > 0){
				isParsing = true;
				break;
			}
		}
		return this;
	}

}


