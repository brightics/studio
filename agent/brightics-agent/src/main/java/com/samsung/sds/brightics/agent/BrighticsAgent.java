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

package com.samsung.sds.brightics.agent;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.AbstractMessage;
import com.samsung.sds.brightics.agent.network.BrighticsNetworkManager;
import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.service.task.RunningTasks;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.core.GrpcMode;
import com.samsung.sds.brightics.common.core.util.DirectoryManager;
import com.samsung.sds.brightics.common.network.proto.ClientReadyMessage;

public class BrighticsAgent {

    private static final Logger logger = LoggerFactory.getLogger(BrighticsAgent.class);

    public static BrighticsNetworkManager network;

    public static String agentId;
    public static String agentHost;
    public static int agentPort;
    public static ReceiveMessageListener listener;
    public static ThreadGroup mainThreadGroup;

    private static Timer terminateTimer;

    public static void main(String[] args) throws Exception {

        mainThreadGroup = Thread.currentThread().getThreadGroup();
        logger.info("Set a temporary directory");
        DirectoryManager.createRootTmpDir("brightics");
        Thread.currentThread().setContextClassLoader(
                new URLClassLoader(new URL[]{new File(DirectoryManager.getClassOutputDir()).toURI().toURL()}, Thread.currentThread().getContextClassLoader()));

        agentId = args[0];
        if (args.length > 1) {
            agentPort = Integer.parseInt(args[1]);
        }

        // init network
        agentHost = SystemEnvUtil.BRIGHTICS_AGENT_HOST;
        String serverHost = SystemEnvUtil.BRIGHTICS_SERVER_HOST;
        int serverPort = Integer.parseInt(SystemEnvUtil.BRIGHTICS_SERVER_PORT);

        logger.info(String.format("Start agent. name: %s, host: %s, port: %s", agentId, agentHost, agentPort <= 0? "none" : String.valueOf(agentPort)));

        // create receive all request message listener
        listener = new ReceiveMessageListener() {
            @Override
            public void messageIsEmpty() {
                if (RunningTasks.count() == 0) {
                    // if request message and running task is empty. start agent terminate timer.
                    agentTerminateTimerSet();
                }
            }

            @Override
            public void receiveNewMessage(AbstractMessage message) {
                logger.debug("Receive message : " + message.toString());
                if (terminateTimer != null) {
                    logger.info("New message received, cancel agent terminate timer.");
                    terminateTimer.cancel();
                }
            }
        };

        if (GrpcMode.getSystemMode() == GrpcMode.LOCAL) {
            network = new BrighticsNetworkManager(agentHost, "core-server", listener);
        } else {
            network = new BrighticsNetworkManager(agentHost, agentPort, serverHost, serverPort, listener);
        }

        try {
            // TODO send ready message to server (and management).
            network.getSender().sendClientReady(ClientReadyMessage.newBuilder().setClientHost(agentHost)
                    .setClientPort(agentPort).setClientId(agentId).build());
        } catch (Exception e) {
            logger.warn("Cannot send ready message to server", e);
        }

        logger.info(String.format("Agent[%s] is Ready.", agentId));
        agentTerminateTimerSet();

        Runtime.getRuntime().addShutdownHook(new Thread("allShutdownHook") {
            @Override
            public void run() {
                destroyProcess();
            }
        });
    }

    public static void agentTerminateTimerSet() {
        if (SystemEnvUtil.IDLE_TIME_MIN <= 0) {
            return;
        }
        if (terminateTimer != null) {
            terminateTimer.cancel();
        }
        terminateTimer = new Timer();
        logger.info(
                "Init agent terminate timer. agent will terminated after " + SystemEnvUtil.IDLE_TIME_MIN + " min.");
        terminateTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                logger.info("Agent over idle time. start to terminate agent.");
                Runtime.getRuntime().exit(0);
            }
        }, SystemEnvUtil.IDLE_TIME_MIN * 1000 * 60L);
    }

    private static void destroyProcess() {
        logger.info("Agent terminated. shutdown all process.");

        File pidfile = new File(SystemEnvUtil.PID_PATH + "/" + agentId + ".pid");
        if (pidfile.exists()) {
            pidfile.delete();
        }

        network.destroy();
    }

}
