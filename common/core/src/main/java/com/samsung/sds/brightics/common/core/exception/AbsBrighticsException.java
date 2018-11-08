package com.samsung.sds.brightics.common.core.exception;

import org.apache.commons.lang3.ArrayUtils;

import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import org.apache.commons.lang3.exception.ExceptionUtils;

public abstract class AbsBrighticsException extends RuntimeException {

	private static final long serialVersionUID = -4011448382576861871L;

	public String code;
	public String message;
	public String detailMessage;

	public AbsBrighticsException() {
	}

	public AbsBrighticsException(String prefix, String code) {
		String exceptionCode = prefix + "-" + code;
		this.code = code;
		this.message = convertMessage(exceptionCode, ArrayUtils.EMPTY_STRING_ARRAY);
	}

	public AbsBrighticsException(String prefix, String code, String... parameters) {
		String exceptionCode = prefix + "-" + code;
        this.code = code;
		this.message = convertMessage(exceptionCode, parameters);
	}

	public <T extends AbsBrighticsException> T addDetailMessage(String detailMessage) {
		this.detailMessage = detailMessage;
		return (T) this;
	}

	@Override
	public String getMessage() {
		return message;
	}

	private String convertMessage(String exceptionCode, String... parameters) {
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
