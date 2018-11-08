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
