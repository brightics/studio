package com.samsung.sds.brightics.common.core.test;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.junit.Test;

import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public class ExceptionTest {

	@Test
	public void messageTest() {
		BrighticsCoreException bce = new BrighticsCoreException("3001");
		String message = bce.getMessage();
		System.out.println(message);
	}

	@Test
	public void messageTestAddParam() {
		BrighticsCoreException bce = new BrighticsCoreException("3002", "test");
		String message = bce.getMessage();
		System.out.println(message);
	}

	@Test
	public void stackTraceTest() {
		BrighticsCoreException bce = new BrighticsCoreException("3001");
		String stackTrace = ExceptionUtils.getStackTrace(bce);
		System.out.println(stackTrace);
	}

	@Test
	public void messageTestAddDetail() {
		BrighticsCoreException bce = new BrighticsCoreException("3001").addDetailMessage("detail message...");
		System.out.println(bce.detailedCause);
	}

	@Test
	public void messageAndstackTraceTestAddDetail() {
		AbsBrighticsException bce = new BrighticsCoreException("3001").addDetailMessage("detail message...");
		String stackTrace = ExceptionUtils.getStackTrace(bce);
		System.out.println(stackTrace);
		System.out.println(bce.detailedCause);
	}
	
}
