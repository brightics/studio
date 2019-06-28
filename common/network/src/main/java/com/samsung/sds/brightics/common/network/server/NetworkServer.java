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

package com.samsung.sds.brightics.common.network.server;

import java.net.InetSocketAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.network.NetworkContext;

import io.grpc.BindableService;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.inprocess.InProcessServerBuilder;
import io.grpc.netty.NettyServerBuilder;


/**
 * This class is java specific network server class
 * that initialize(add receiver service) gRPC server and start or close server.
 *
 * @author hk.im
 */
public class NetworkServer {

    private static final Logger logger = LoggerFactory.getLogger(NetworkServer.class);

    private final Server server;
    private final NetworkContext context;

    public static final int MAXIMUM_MESSAGE_SIZE = Integer
            .parseInt(SystemEnvUtil.getEnvOrPropOrElse("GRPC_STREAM_MAX_SIZE", "brightics.grpc.stream.maxSize", Integer.toString(32 * 1024 * 1024)));
    public static final int MAXIMUM_BYTESTREAM_SIZE = MAXIMUM_MESSAGE_SIZE - 1000; //remove temp key size. 

    public NetworkServer(NetworkContext context, BindableService... bindableServices) {
        this.context = context;
        this.server = buildServer(context, bindableServices);
    }

    private Server buildServer(NetworkContext context, BindableService... bindableServices) {
        ServerBuilder serverBuilder;

        if (context.isLocalMode()) {
            serverBuilder = InProcessServerBuilder.forName(context.hostname)
                    .directExecutor();
        } else {
            serverBuilder = NettyServerBuilder.forAddress(new InetSocketAddress(context.hostname, context.port))
                    .maxMessageSize(MAXIMUM_MESSAGE_SIZE);
        }

        if (bindableServices != null) {
            for (BindableService bindableService : bindableServices) {
                serverBuilder.addService(bindableService);
            }
        }

        return serverBuilder.build();
    }

    public void start() {
        Runnable run = () -> {
            try {
                logger.info(String.format("[Common network] network server starting. host [%s] port [%s].",
                        context.hostname, String.valueOf(context.port)));
                server.start();
                server.awaitTermination();
            } catch (Exception e) {
                logger.error("[Common network] server run exception. can not start server.", e);
            }
        };
        Thread thread = new Thread(run, "NetworkServer");
        try {
            thread.start();
        } catch (Exception e) {
            logger.error("[Common network] fail to start network server.", e);
        }
    }

    public void shutdown() {
        logger.info("[Common network] network Server shut down.");
        if (server != null) {
            server.shutdown();
        }
    }

}
