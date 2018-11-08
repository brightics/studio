package com.samsung.sds.brightics.common.network.util;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.inprocess.InProcessChannelBuilder;

public class ChannelUtil {

    //create channel using address
    public static ManagedChannel managedChannelCreator(String remoteHostname, int remotePort) {
        return ManagedChannelBuilder.forAddress(remoteHostname, remotePort)
                .maxInboundMessageSize(2147483647)
                .usePlaintext(true)
                .build();
    }

    // create channel using InProcess
    public static ManagedChannel managedChannelCreator(String name) {
        return InProcessChannelBuilder.forName(name)
                .maxInboundMessageSize(2147483647)
                .usePlaintext(true)
                .directExecutor()
                .build();
    }
}
