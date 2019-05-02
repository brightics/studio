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

package com.samsung.sds.brightics.server.service;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcDatasources;
import com.samsung.sds.brightics.server.model.entity.BrtcS3Datasource;
import com.samsung.sds.brightics.server.model.entity.BrtcScript;
import com.samsung.sds.brightics.server.model.entity.BrtcSql;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcDatasourcesRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcS3DatasourceRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcScriptRepository;

@Service
public class MetadataConverterService {

    @Autowired
    public DatabaseService databaseService;

    @Autowired
    public BrtcDatasourcesRepository brtcDatasourcesRepository;

    @Autowired
    public BrtcScriptRepository brtcScriptRepository;
    
    @Autowired
    public BrtcS3DatasourceRepository brtcS3DatasourceRepository;


    public static final String METADATA_KEY = "metadata";
    private Map<String, Function<JsonObject, JsonElement>> metadataRepositoryFunctions = new HashMap<>();
    
    public final Function<JsonObject, JsonElement> SQL = new Function<JsonObject, JsonElement>() {

        @Override
        public JsonElement apply(JsonObject t) {
            BrtcSql brtcSql = JsonUtil.fromJson(t, BrtcSql.class);
            String formattedSql = databaseService.getSqlWithCondition(brtcSql);
            return new JsonPrimitive(formattedSql);
        }

    };
    public final Function<JsonObject, JsonElement> SCRIPT = new Function<JsonObject, JsonElement>() {

        @Override
        public JsonElement apply(JsonObject t) {
            BrtcScript brtcScript = JsonUtil.fromJson(t, BrtcScript.class);
            BrtcScript scriptResult = brtcScriptRepository.findOne(brtcScript.getScriptId());
            ValidationUtil.throwIfEmpty(scriptResult, "script");
            return JsonUtil.toJsonObject(scriptResult);
        }

    };
    public final Function<JsonObject, JsonElement> DATASOURCE = new Function<JsonObject, JsonElement>() {

        @Override
        public JsonElement apply(JsonObject t) {
            BrtcDatasources brtcDatasource = JsonUtil.fromJson(t, BrtcDatasources.class);
            BrtcDatasources datasourceResult = brtcDatasourcesRepository.findOne(brtcDatasource.getDatasourceName());
            ValidationUtil.throwIfEmpty(datasourceResult, "Data Source for db");
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("ip", datasourceResult.getIp());
            resultMap.put("port", datasourceResult.getPort());
            resultMap.put("username", datasourceResult.getUserName());
            resultMap.put("password", datasourceResult.getPassword());
            resultMap.put("dbName", datasourceResult.getDbName());
            resultMap.put("dbType", datasourceResult.getDbType());
            return JsonUtil.toJsonObject(resultMap);
        }

    };
    public final Function<JsonObject, JsonElement> S3_DATASOURCE = new Function<JsonObject, JsonElement>() {
        
        @Override
        public JsonElement apply(JsonObject t) {
            BrtcS3Datasource brtcS3Datasource = JsonUtil.fromJson(t, BrtcS3Datasource.class);
            BrtcS3Datasource datasourceResult = brtcS3DatasourceRepository.findOne(brtcS3Datasource.getDatasourceName());
            ValidationUtil.throwIfEmpty(datasourceResult, "datasource for s3");
            return JsonUtil.toJsonObject(datasourceResult);
        }
        
    };

    @PostConstruct
    public void initConverterFunctions() {
        metadataRepositoryFunctions.put("sql", SQL);
        metadataRepositoryFunctions.put("script", SCRIPT);
        metadataRepositoryFunctions.put("datasource", DATASOURCE);
        metadataRepositoryFunctions.put("s3", S3_DATASOURCE);
    }

    public boolean isMetadataRequest(JsonObject json) {
        return json.has(METADATA_KEY) && metadataRepositoryFunctions.containsKey(json.get(METADATA_KEY).getAsString());
    }

    public JsonElement convert(JsonObject json) {
        Function<JsonObject, JsonElement> func = metadataRepositoryFunctions.get(json.get(METADATA_KEY).getAsString());
        if (func == null) {
            return json;
        } else {
            return func.apply(json);
        }
    }

}
