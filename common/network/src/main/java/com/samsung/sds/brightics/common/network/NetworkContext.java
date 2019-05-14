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

package com.samsung.sds.brightics.common.network;

import java.util.Set;

import com.samsung.sds.brightics.common.core.GrpcMode;
import com.samsung.sds.brightics.common.network.config.NetworkConfig;
import com.samsung.sds.brightics.common.network.sender.MessageSender;
import com.samsung.sds.brightics.common.network.sender.SenderManager;
import com.samsung.sds.brightics.common.network.server.NetworkServer;

import io.grpc.BindableService;

/**
 * This class is network framework main class
 *
 * @author hk.im
 */
public class NetworkContext {

    public final GrpcMode mode;
    public String hostname;
    public Integer port;
    public NetworkConfig config;

    public NetworkContext(String hostname, int port, NetworkConfig config) {
        this.mode = GrpcMode.REMOTE;
        this.hostname = hostname;
        this.port = port;
        this.config = config;
    }

    public NetworkContext(String name, NetworkConfig config) {
        this.mode = GrpcMode.LOCAL;
        this.hostname = name;
        this.config = config;
    }

    public NetworkServer createNetwork(BindableService... receivers) {
        return new NetworkServer(this, receivers);
    }

    public void registerMultiSender(String senderId, String remoteHostname, int remotePort) {
        if (remotePort <= 0) {
            SenderManager.registerSender(senderId, remoteHostname, config);
        } else {
            SenderManager.registerSender(senderId, remoteHostname, remotePort, config);
        }
    }

    public MessageSender getSender(String senderId) {
        return SenderManager.getSender(senderId);
    }

    public Set<String> getSenders() {
        return SenderManager.getSenders();
    }

    public MessageSender createSingleSender(String remoteHostname, int remotePort) {
        return SenderManager.createSingleSender(remoteHostname, remotePort, config);
    }

    public MessageSender createSingleSender(String remoteName) {
        return SenderManager.createSingleSender(remoteName, config);
    }

    public boolean isLocalMode() {
        return this.mode == GrpcMode.LOCAL;
    }
}
