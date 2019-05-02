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

import org.apache.commons.lang3.ArrayUtils;

import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import com.samsung.sds.brightics.common.core.util.JsonUtil;

import org.apache.commons.lang3.exception.ExceptionUtils;

public abstract class AbsBrighticsException extends RuntimeException {

	private static final long serialVersionUID = -4011448382576861871L;

	public static final String HYPHEN = "-";
	
	public String code;
	public String message;
	public String detailedCause;

	public AbsBrighticsException() {
	}

	public AbsBrighticsException(String prefix, String code) {
		String exceptionCode = prefix + HYPHEN + code;
		this.code = code;
		this.message = convertMessage(exceptionCode, ArrayUtils.EMPTY_STRING_ARRAY);
	}

	public AbsBrighticsException(String prefix, String code, String... parameters) {
		String exceptionCode = prefix + HYPHEN + code;
        this.code = code;
		this.message = convertMessage(exceptionCode, parameters);
	}

	public <T extends AbsBrighticsException> T addDetailMessage(String detailedCause) {
		this.detailedCause = detailedCause;
		return (T) this;
	}

	@Override
	public String getMessage() {
		return message;
	}
	
	public String getErrorsJson() {
		return JsonUtil.toJson(this);
	}

	public String convertMessage(String exceptionCode, String... parameters) {
		String rootMessage = ExceptionProvider.getExceptionMessage(exceptionCode);
		if (parameters == null || parameters.length == 0) {
			return rootMessage;
		} else {
			return String.format(rootMessage, (Object[]) parameters);
		}
	}

	@Override
	public AbsBrighticsException initCause(Throwable e) {
		super.initCause(e);
		addDetailMessage(ExceptionUtils.getStackTrace(e));
		return this;
	}
}
