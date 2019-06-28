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
