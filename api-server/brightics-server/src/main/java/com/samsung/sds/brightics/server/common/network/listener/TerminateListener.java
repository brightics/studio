package com.samsung.sds.brightics.server.common.network.listener;

import com.samsung.sds.brightics.common.network.listener.AbstractTerminateListener;
import com.samsung.sds.brightics.server.common.thread.concurrent.JobModelExecuteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TerminateListener extends AbstractTerminateListener {

    private static final Logger logger = LoggerFactory.getLogger(TerminateListener.class);

    @Override
    public void clientTerminated(String clientId) {
        logger.info(String.format("Client [%s] is terminated", clientId));
        JobModelExecuteService.removeAgentExecutor(clientId);
    }

}
