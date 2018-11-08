package com.samsung.sds.brightics.server;

import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.agent.BrighticsAgent;
import com.samsung.sds.brightics.common.core.GrpcMode;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;

//TODO If you start the agent optionally. Set up your profile.
//@Profile(value="opensource")
@Service
public class InitBrighticsAgent {

    @Value(value = "${brightics.agent.port:9090}")
    private String agentPort;

    @Value(value = "${server.address:localhost}")
    private String serverAddress;

    @Value(value = "${brightics.server.grpc.port:9098}")
    private String serverGrpcPort;

    private static final Logger logger = LoggerFactory.getLogger(Application.class);

    public void autoConfigurer() {
        System.setProperty("brightics.agent.home", getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME));
        System.setProperty("brightics.function.home", getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME, "functions"));
        System.setProperty("brightics.agent.host", serverAddress);
        System.setProperty("brightics.server.host", serverAddress);
        System.setProperty("brightics.server.port", serverGrpcPort);
        System.setProperty("brightics.data.root", getAbsolutePath(SystemEnvUtil.BRIGHTICS_SERVER_HOME, "data"));
        System.setProperty("brightics.agent.idleTimeMin", "0");
        System.setProperty("brightics.kv.store", "H2");
        System.setProperty("brightics.grpc.mode", "local");
        SystemEnvUtil.refresh();
    }

    public void startAgent() {
        try {
            logger.info("Start Brightics agent.");
            autoConfigurer();
            if (GrpcMode.getSystemMode() == GrpcMode.LOCAL) {
                BrighticsAgent.main(new String[]{"BRIGHTICS"});
            } else {
                BrighticsAgent.main(new String[]{"BRIGHTICS", agentPort});
            }
        } catch (Exception e) {
            logger.info("Cannot execute agent.", e);
        }
    }

    private String getAbsolutePath(String first, String... more) {
        String absPath = Paths.get(first, more).normalize().toAbsolutePath().toUri().getPath().replaceAll("/$", "");
        if (absPath.matches("^/.+:/.*")) {
            // remove first slash when path contains windows disk name
            absPath = absPath.substring(1);
        }
        return absPath;
    }
}
