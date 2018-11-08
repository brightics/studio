package com.samsung.sds.brightics.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@SpringBootApplication
@EnableEncryptableProperties
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    // TODO If you start the agent optionally. Set up your profile.
    // @Profile(value="opensource")
    @Bean(name = "InitBrighticsAgent", initMethod = "startAgent")
    @DependsOn("brighticsNetworkManager")
    public InitBrighticsAgent initBrighticsAgent() {
        return new InitBrighticsAgent();
    }
}
