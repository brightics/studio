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

package com.samsung.sds.brightics.common.network.sender;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.samsung.sds.brightics.common.network.config.NetworkConfig;
import com.samsung.sds.brightics.common.network.util.ChannelUtil;

import io.grpc.ManagedChannel;

/**
 * This class is java specific sender management class
 * that register message sender and get or remove that.
 *
 * @author hk.im
 */
public final class SenderManager {

    private final static Map<String, MessageSender> senderMap = new ConcurrentHashMap<>();

    private SenderManager() {
    }

    public static void registerSender(String clientId, String remoteHostname, int remotePort,
            NetworkConfig config) {
        ManagedChannel channel = ChannelUtil.managedChannelCreator(remoteHostname, remotePort);
        MessageSender sender = new MessageSender(clientId, channel, config);
        senderMap.put(clientId, sender);
    }

    public static void registerSender(String clientId, String name, NetworkConfig config) {
        ManagedChannel channel = ChannelUtil.managedChannelCreator(name);
        MessageSender sender = new MessageSender(clientId, channel, config);
        senderMap.put(clientId, sender);
    }

    public static MessageSender createSingleSender(String remoteHostname, int remotePort, NetworkConfig config) {
        ManagedChannel channel = ChannelUtil.managedChannelCreator(remoteHostname, remotePort);
        return new MessageSender(channel, config);
    }

    public static MessageSender createSingleSender(String name, NetworkConfig config) {
        ManagedChannel channel = ChannelUtil.managedChannelCreator(name);
        return new MessageSender(channel, config);
    }

    public static MessageSender getSender(String clientId) {
        return senderMap.get(clientId);
    }

    public static Set<String> getSenders() {
        if (senderMap.size() > 0) {
            return senderMap.keySet();
        } else {
            return Collections.emptySet();
        }
    }

    public static void removeSender(String clientId) {
        senderMap.remove(clientId);
    }
}
