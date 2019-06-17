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

package com.samsung.sds.brightics.lightweight;

import java.net.ServerSocket;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.lightweight.job.thread.jobRunnerThread;

public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {

        int port = 5351;
        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        // create thread pool executor as max size.
        int maxConcurrentJobs = Integer.parseInt(
                SystemEnvUtil.getEnvOrPropOrElse("MODEL_CONCURRENT_COUNT", "brightics.lightweight.concurrent.count", "10"));
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(getMaxPoolSizeBy(maxConcurrentJobs), getMaxPoolSizeBy(maxConcurrentJobs), 0L,
                TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>());

        try (ServerSocket listener = new ServerSocket(port)) {
            listener.setSoTimeout(0);
            logger.info("Brightics lightweight engine is listening on port " + port);
            while (true) {
                new jobRunnerThread(listener.accept(), threadPoolExecutor).start();
            }
        } catch (Throwable e) {
            logger.error("", e);
        }
    }

    private static int getMaxPoolSizeBy(int maxConcurrentJobs) {
        int numAvailableCores = Runtime.getRuntime().availableProcessors();
        return maxConcurrentJobs == 0 ? numAvailableCores : Math.min(numAvailableCores, maxConcurrentJobs);
    }

}
