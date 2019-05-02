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

package com.samsung.sds.brightics.agent.network;

import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.network.receiver.CommonReceiver;
import com.samsung.sds.brightics.agent.network.receiver.DatabaseReceiver;
import com.samsung.sds.brightics.agent.network.receiver.MetaDataReceiver;
import com.samsung.sds.brightics.agent.network.receiver.StreamReceiver;
import com.samsung.sds.brightics.agent.network.receiver.TaskReceiver;
import com.samsung.sds.brightics.common.network.NetworkContext;
import com.samsung.sds.brightics.common.network.config.NetworkConfig;
import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.common.network.server.NetworkServer;
import com.samsung.sds.brightics.agent.network.listener.TerminateListener;

public class BrighticsNetworkManager {

    private final NetworkContext context;
    private final NetworkServer server;
    private final String remoteHost;
    private final int remotePort;
    private MessageSender sender;

    public BrighticsNetworkManager(String host, int port, String remoteHost, int remotePort, ReceiveMessageListener listener) {
        this.remoteHost = remoteHost;
        this.remotePort = remotePort;
        context = new NetworkContext(host, port, NetworkConfig.newConfig()
                .setCheckHeartbeat(true).setHeartbeatTime(1000).setTerminateListener(new TerminateListener()));
        server = context.createNetwork(new CommonReceiver()
                , new TaskReceiver(listener), new StreamReceiver(listener), new MetaDataReceiver(listener)
                , new DatabaseReceiver(listener));
        server.start();
    }

    public BrighticsNetworkManager(String hostName, String remoteName, ReceiveMessageListener listener) {
        this.remoteHost = remoteName;
        this.remotePort = -1;
        context = new NetworkContext(hostName, NetworkConfig.newConfig()
                .setCheckHeartbeat(true).setHeartbeatTime(1000).setTerminateListener(new TerminateListener()));
        server = context.createNetwork(new CommonReceiver()
                , new TaskReceiver(listener), new StreamReceiver(listener), new MetaDataReceiver(listener)
                , new DatabaseReceiver(listener));
        server.start();
    }

    public void destroy() {
        server.shutdown();
    }

    public MessageSender getSender() {
        if (sender == null) {
            if (context.isLocalMode()) {
                sender = context.createSingleSender(remoteHost);
            } else {
                sender = context.createSingleSender(remoteHost, remotePort);
            }
        }
        return sender;
    }
}
