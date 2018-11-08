package com.samsung.sds.brightics.common.core.exception;

public class BrighticsCoreException extends AbsBrighticsException {

	private static final long serialVersionUID = -3633991840267802490L;

	public BrighticsCoreException(String code) {
		super("CR", code);
	}

	public BrighticsCoreException(String code, String... params) {
		super("CR", code, params);
	}
	
}
