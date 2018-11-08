package com.samsung.sds.brightics.common.core.exception;

public class BrighticsFunctionException extends AbsBrighticsException {

	private static final long serialVersionUID = -3633991840267802490L;

	public BrighticsFunctionException(String code) {
		super("FN", code);
	}

	public BrighticsFunctionException(String code, String... params) {
		super("FN", code, params);
	}
}
