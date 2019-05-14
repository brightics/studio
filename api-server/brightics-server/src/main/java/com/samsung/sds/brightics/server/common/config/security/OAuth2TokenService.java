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

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import com.samsung.sds.brightics.server.model.entity.BrighticsAgentUserMap;
import com.samsung.sds.brightics.server.model.entity.repository.BrighticsAgentUserMapRepository;

public class OAuth2TokenService implements ResourceServerTokenServices {

    protected static final Logger LOGGER = LoggerFactory.getLogger(OAuth2TokenService.class);

    private final RestOperations restTemplate;

    @Value("${brightics.auth.address}")
    private String AUTH_SERVER_ADDRESS;
    @Value("${brightics.auth.id}")
    private String AUTH_SERVER_ID;
    @Value("${brightics.auth.secret:api_server_core_secret}")
    private String AUTH_SERVER_SECRET;
    @Value("${brightics.auth.token.url:/api/account/v2/oauth2/token/validate}")
    private String CHECK_TOKEN_URL;

    private final AccessTokenConverter tokenConverter = new DefaultAccessTokenConverter();

    public OAuth2TokenService() {
        restTemplate = new RestTemplate();
        ((RestTemplate) restTemplate).setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public void handleError(ClientHttpResponse response) throws IOException {
                if (response.getRawStatusCode() != 400) {
//                    super.handleError(response);
                    throw OAuth2Exception.create(OAuth2Exception.UNAUTHORIZED_CLIENT, null);
                }
            }
        });
    }

    @Autowired
    private BrighticsAgentUserMapRepository brighticsAgentUserRepository;

    public Authentication basicAuthenticate(String userId, String password) throws AuthenticationException {
        try {
            BrighticsAgentUserMap brighticsAgentUser = brighticsAgentUserRepository.findOne(userId);
            if (brighticsAgentUser == null) {
                throw new BadCredentialsException("This userID does not exist.");
            }
            Collection<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            return new UsernamePasswordAuthenticationToken(new org.springframework.security.core.userdetails.User(userId, "", authorities), "", authorities);
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

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
        boolean isKeepSession = false;
        if (accessToken.startsWith("Basic")) {
            // old basic auth method
            String decodedToken;
            try {
                decodedToken = new String(Base64.decode(accessToken.substring(5).trim().getBytes("UTF-8")), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                LOGGER.error("encoding error", e);
                throw (OAuth2Exception) OAuth2Exception.create(OAuth2Exception.INVALID_REQUEST, "Unsupported encoding.");
            }
            String[] credentials = decodedToken.split(":");
            if (credentials.length != 2) {
                throw OAuth2Exception.create(OAuth2Exception.INVALID_TOKEN, "Token format is not valid. {username:password} needed.");
            }
            try {
                Authentication auth = basicAuthenticate(credentials[0], credentials[1]);
                checkAuthResponse.put("user_name", auth.getName());
                checkAuthResponse.put("clinet_id", "sessionID");
                checkAuthResponse.put("authorities", auth.getAuthorities().iterator().next().getAuthority());
                isKeepSession = true;
            } catch (Exception e) {
                LOGGER.error("invalid token", e);
                throw OAuth2Exception.create(OAuth2Exception.INVALID_TOKEN, e.getMessage());
            }
        } else {
            // oauth method
            checkAuthResponse = checkAccessToken(accessToken);
            boolean failed = (boolean) checkAuthResponse.getOrDefault("fail", false);
            if (failed) {
                throw OAuth2Exception.create(OAuth2Exception.UNAUTHORIZED_CLIENT, null);
            }
        }
        OAuth2Authentication token = tokenConverter.extractAuthentication(checkAuthResponse);
        token.setAuthenticated(true);
        if(isKeepSession) token.setDetails("keep_session");
        else token.setDetails("no_session");
        return token;
    }

    private String getAuthURL() {
        return "http://" + AUTH_SERVER_ADDRESS + CHECK_TOKEN_URL;
    }

    @SuppressWarnings("unchecked")
	private Map<String, Object> checkAccessToken(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("access_token", accessToken);
        formData.add("server_id", AUTH_SERVER_ID);
        formData.add("server_secret", AUTH_SERVER_SECRET);

        return restTemplate.exchange(getAuthURL(), HttpMethod.POST, new HttpEntity<MultiValueMap<String, String>>(formData, headers), Map.class).getBody();
    }

    @Override
    public OAuth2AccessToken readAccessToken(String accessToken) {
        throw new UnsupportedOperationException("Not supported: read access token");
    }

}
