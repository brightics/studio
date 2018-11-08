package com.samsung.sds.brightics.common.core;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;

public enum GrpcMode {
    LOCAL, REMOTE;

    public static GrpcMode getSystemMode() {
        return GrpcMode
                .valueOf(SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_GRPC_MODE", "brightics.grpc.mode", "remote").toUpperCase());
    }
}
