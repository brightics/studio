/*
    Copyright 2020 Samsung SDS

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

package com.samsung.sds.brightics.server.common.http;

import com.google.gson.JsonObject;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

@Configuration
public class BrighticsCommonRestTemplate {

    @Value("${brightics.common.server.address:localhost}")
    private String commonServerAddress;

    @Value("${brightics.common.server.port:9097}")
    private String commonServerPort;

    @Value("${brightics.local.token}")
    private String accessToken;

    private static final String AUTH_HEADER_START_WITH = "Bearer";

    public HttpHeaders makeTrustedAppHeaders() {
        HttpHeaders trustedAppHeaders = new HttpHeaders();
        trustedAppHeaders.add(HttpHeaders.AUTHORIZATION, AUTH_HEADER_START_WITH + " " + accessToken);
        trustedAppHeaders.setContentType(MediaType.APPLICATION_JSON);
        return trustedAppHeaders;
    }

    private static RestTemplate RT;
    private static RestTemplate getRT(){
        if(RT == null){
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(30*1000);
            factory.setReadTimeout(0);
            factory.setHttpClient(
                HttpClients.custom().setDefaultRequestConfig(RequestConfig.custom().setCookieSpec(CookieSpecs.STANDARD).build()).build());
            RT = new RestTemplate(factory);
        }
        return RT;
    }

    public Map<String, Object> post(String apiUrl, Map<String, String> pathParams, Map<String, String> queryParams, JsonObject body, String requestUser) {
        return getRT().exchange(
                getFullUrl(apiUrl, pathParams, queryParams),
                HttpMethod.POST,
                new HttpEntity<>(body.toString(), makeTrustedAppHeaders()),
                Map.class).getBody();
    }

    public Map<String, Object> get(String apiUrl, Map<String, String> pathParams, Map<String, String> queryParams, String requestUser) {
        return getLike(HttpMethod.GET, apiUrl, pathParams, queryParams, requestUser);
    }

    public Map<String, Object> delete(String apiUrl, Map<String, String> pathParams, Map<String, String> queryParams, String requestUser) {
        return getLike(HttpMethod.DELETE, apiUrl, pathParams, queryParams, requestUser);
    }

    private Map<String, Object> getLike(HttpMethod method, String apiUrl, Map<String, String> pathParams, Map<String, String> queryParams, String requestUser) {
        return getRT().exchange(
                getFullUrl(apiUrl, pathParams, queryParams),
                method,
                new HttpEntity<>(makeTrustedAppHeaders()),
                Map.class).getBody();
    }

    public URI getFullUrl(String apiUrl, Map<String, String> pathParams, Map<String, String> queryParams) {
        if(pathParams == null){
            pathParams = Collections.EMPTY_MAP;
        }
        if(queryParams == null){
            queryParams = Collections.EMPTY_MAP;
        }

        String url = "http://"+commonServerAddress + ":" + commonServerPort + apiUrl;

        // Query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
        if (queryParams != null) {
            for (Map.Entry<String, String> pair : queryParams.entrySet()) {
                builder.queryParam(pair.getKey(), pair.getValue());
            }
        }

        return builder.buildAndExpand(pathParams).toUri();
    }

}
