package com.samsung.sds.brightics.server.common.config.security;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PropertyEncryptConfig {

	@Bean(name = { "jasyptStringEncryptor" })
	static public StringEncryptor stringEncryptor() {
		PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
		SimpleStringPBEConfig config = new SimpleStringPBEConfig();
		config.setPassword("BRTC_PASS");
		config.setAlgorithm("PBEWithMD5AndDES");
		config.setKeyObtentionIterations("1000");
		config.setPoolSize("1");
		config.setProviderName("SunJCE");
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
		config.setStringOutputType("base64");
		encryptor.setConfig(config);
		return encryptor;
	}
	
	public String encryptPasswordToString(String encrytPassword){
		StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();  
		encryptor.setPassword("BRTC_PASS");
		encryptor.setAlgorithm("PBEWithMD5AndDES");
		encryptor.setProviderName("SunJCE");
		encryptor.setStringOutputType("base64");
		String decrypt = encryptor.decrypt(encrytPassword);
		return decrypt;
	}

	public String passwordToEncryptPassword(String password){
		StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();  
		encryptor.setPassword("BRTC_PASS");
		encryptor.setAlgorithm("PBEWithMD5AndDES");
		encryptor.setProviderName("SunJCE");
		encryptor.setStringOutputType("base64");
		return encryptor.encrypt(password);
	}
}
