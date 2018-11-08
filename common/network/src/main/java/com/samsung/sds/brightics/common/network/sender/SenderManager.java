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
