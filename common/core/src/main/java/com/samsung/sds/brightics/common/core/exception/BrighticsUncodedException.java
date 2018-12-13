package com.samsung.sds.brightics.common.core.exception;

/**
 * This exception class is used to pass only messages without code.
 * use case
 * #1. when run function fail. combine multiple exception message to on message and send. 
 * #2. when server receive fail result from agent. result don't have code or parameters.
 */
public class BrighticsUncodedException extends AbsBrighticsException {
	
	private static final long serialVersionUID = -1509602533254552744L;

	public BrighticsUncodedException(String message) {
		super.message = message;
	}

	public BrighticsUncodedException(String message, String detailedCause) {
		super.message = message;
		super.detailedCause = detailedCause;
	}

}
