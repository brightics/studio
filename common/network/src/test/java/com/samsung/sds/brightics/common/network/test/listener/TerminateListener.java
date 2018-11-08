package com.samsung.sds.brightics.common.network.test.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.listener.AbstractTerminateListener;

public class TerminateListener extends AbstractTerminateListener {

	private static final Logger logger = LoggerFactory.getLogger(TerminateListener.class);

	@Override
	public void clientTerminated(String clientId) {
		logger.info(String.format("[Common network] Client [%s] is terminated", clientId));
	}

}
