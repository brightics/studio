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
