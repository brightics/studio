package com.samsung.sds.brightics.agent.util;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;

public class ThreadUtil {

	public static String getCurrentUser() {
		try {
			return ThreadLocalContext.get("user").toString();
		} catch (Exception e) {
			throw new BrighticsCoreException("3002", "thread user");
		}
	}

}
