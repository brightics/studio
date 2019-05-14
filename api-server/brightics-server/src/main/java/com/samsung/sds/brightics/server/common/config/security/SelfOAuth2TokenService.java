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

package com.samsung.sds.brightics.server.common.config.security;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;

@Configuration
public class SelfOAuth2TokenService implements ResourceServerTokenServices {

    protected static final Logger LOGGER = LoggerFactory.getLogger(SelfOAuth2TokenService.class);

    @Value("${brightics.local.user:brightics}")
    private String localUser;
    @Value("${brightics.local.token}")
    private String localToken;

    private final AccessTokenConverter tokenConverter = new DefaultAccessTokenConverter();

    /**
     * Three parameters to make OAuth2Authentication.
     * 
     * 1. user_name String // integrated user_name
     * 2. client_id String // may be va sessionid
     * 3. authorities Array[String] // managed by brightics-server
     */
    @Override
    public OAuth2Authentication loadAuthentication(String accessToken) throws AuthenticationException, InvalidTokenException {
        Map<String, Object> checkAuthResponse = new HashMap<>();
        if (accessToken.contains(localToken) || "public".equals(localToken)) {
            try {
                checkAuthResponse.put("user_name", localUser);
                checkAuthResponse.put("client_id", "localuser");
                checkAuthResponse.put("authorities", "ADMIN");
                OAuth2Authentication token = tokenConverter.extractAuthentication(checkAuthResponse);
                token.setAuthenticated(true);
                return token;
            } catch (Exception e) {
                LOGGER.error("invalid token", e);
                throw OAuth2Exception.create(OAuth2Exception.INVALID_TOKEN, e.getMessage());
            }
        } else {
            throw OAuth2Exception.create(OAuth2Exception.UNAUTHORIZED_CLIENT, null);
        }
    }

    @Override
    public OAuth2AccessToken readAccessToken(String accessToken) {
        throw new UnsupportedOperationException("Not supported: read access token");
    }

}
