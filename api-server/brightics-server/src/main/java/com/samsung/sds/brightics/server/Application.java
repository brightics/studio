package com.samsung.sds.brightics.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;

@SpringBootApplication
public class Application {
	

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    // TODO If you start the agent optionally. Set up your profile.
    // @Profile(value="opensource")
    @Bean(name = "InitBrighticsAgent", initMethod = "startAgent")
    @DependsOn("brighticsNetworkManager")
    public InitBrighticsAgent initBrighticsAgent() {
    	Logger logger = LoggerFactory.getLogger("JB");
    	logger.info("#############START");
        return new InitBrighticsAgent();
    }
}
