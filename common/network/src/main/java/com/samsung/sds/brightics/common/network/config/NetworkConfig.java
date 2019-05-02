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
