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

package com.samsung.sds.brightics.common.core.legacy.exception;

import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.legacy.provider.LegacyFunctionLabelProvider;

/**
 * This class is used for legacy function or script exception.
 * legacy exception code contain 'BR-' and codes are defined in common core.   
 */
public class BrighticsLegacyException extends AbsBrighticsException {
	
	private static final long serialVersionUID = 1L;

	public BrighticsLegacyException(String code) {
		super("BR", code.replace("BR-", ""));
	}

	public BrighticsLegacyException(String code, String functionName, String[] params) {
		//legacy function parameters should change display label name.
		super("BR", code.replace("BR-", ""), LegacyFunctionLabelProvider.getFunctionLabel(functionName, params));
	}

}
