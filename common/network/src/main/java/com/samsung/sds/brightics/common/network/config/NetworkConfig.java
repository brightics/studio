package com.samsung.sds.brightics.common.network.config;

import com.samsung.sds.brightics.common.network.listener.AbstractTerminateListener;


/**
 * This class is network configuration setting class
 * that set heart beat check or add terminateListener.
 *
 * TODO add more configuration for network framework.
 *
 * @author hk.im
 */
public class NetworkConfig {


    private AbstractTerminateListener terminateListener;
    private boolean checkHeartbeat = false;
    private long heartbeatTime = 5000;

    private static final NetworkConfig DEFAULT_INSTANCE;

    static {
        DEFAULT_INSTANCE = new NetworkConfig();
    }

    public static NetworkConfig newConfig() {
        return DEFAULT_INSTANCE;
    }

    public NetworkConfig setCheckHeartbeat(boolean isCheckHeartbeat) {
        this.checkHeartbeat = isCheckHeartbeat;
        return this;
    }

    public boolean getIsCheckHeartbeat() {
        return this.checkHeartbeat;
    }

    public NetworkConfig setHeartbeatTime(long heartbeatTime) {
        this.heartbeatTime = heartbeatTime;
        return this;
    }

    public long getHeartbeatTime() {
        return this.heartbeatTime;
    }

    public NetworkConfig setTerminateListener(AbstractTerminateListener terminateListener) {
        this.terminateListener = terminateListener;
        return this;
    }

    public AbstractTerminateListener getTerminateListener() {
        return terminateListener;
    }
}
