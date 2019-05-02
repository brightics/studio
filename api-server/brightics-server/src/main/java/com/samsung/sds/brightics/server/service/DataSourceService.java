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

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcDatasources;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcDatasourcesRepository;

/**
 * This class of service manages the data source used to connect to the database.
 * The driver types provided are oracle, postgre, maria, mysql. 
 * @author hk.im
 */
@Service
public class DataSourceService {
 
    @SuppressWarnings("unused")
    private static final Logger logger = LoggerFactory.getLogger(DataSourceService.class);

    @Autowired
    BrtcDatasourcesRepository brtcDatasourcesRepository;

    //TODO Need to know where to get the type.
    public List<String> getDBTyepList(){
        List<String> dbTypeList = new ArrayList<>();
        dbTypeList.add("postgre");
        dbTypeList.add("oracle");
        dbTypeList.add("mariadb");
        dbTypeList.add("mysql");
        return dbTypeList;
    }
    
    public String getUrlAsBrtcDatasourceInfo(BrtcDatasources brtcDatasources){
        String ip = brtcDatasources.getIp();
        String port = brtcDatasources.getPort();
        String dbName = brtcDatasources.getDbName();
        if("oracle".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))){
            return "jdbc:oracle:thin:@//" + ip + ":" + port + "/" + dbName;
        } else if("mariadb".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))
                ||"mysql".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))){
            return "jdbc:mysql://"+ ip + ":" + port + "/" + dbName;
        }
        return "jdbc:postgresql://"+ ip + ":" + port + "/" + dbName;
    }
    public String getDriverAsBrtcDatasourceInfo(BrtcDatasources brtcDatasources){
        if("oracle".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))){
            return "oracle.jdbc.driver.OracleDriver";
        } else if("mariadb".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))
                ||"mysql".equals(StringUtils.lowerCase(brtcDatasources.getDbType()))){
            return "com.mysql.jdbc.Driver";
        }
        return "org.postgresql.Driver";
    }
    
    //get rdb datasource type. 
    //TODO except default BRIGHTICS and alluxio , hive information (is deprecated) 
    @SuppressWarnings("deprecation")
    public List<BrtcDatasources> getRdbDatasourcesList() {
        Iterable<BrtcDatasources> findAll = brtcDatasourcesRepository.findAll();
        List<BrtcDatasources> dsList = new ArrayList<>();
        for (BrtcDatasources brtcDatasources : findAll) {
            if (!brtcDatasources.isDeploy() 
                    && !"BRIGHTICS".equals(brtcDatasources.getDatasourceName())
                    && !"ALLUXIO".equals(brtcDatasources.getDatasourceType())
                    && !"HDFS".equals(brtcDatasources.getDatasourceType())){
                dsList.add(brtcDatasources);
            }
        }
        return dsList;
    }
    
    //get deploy datasource type.
    public List<BrtcDatasources> getDeployDatasourcesList() {
        Iterable<BrtcDatasources> findAll = brtcDatasourcesRepository.findAll();
        List<BrtcDatasources> dsList = new ArrayList<>();
        for (BrtcDatasources brtcDatasources : findAll) {
            if (brtcDatasources.isDeploy()){
                dsList.add(brtcDatasources);
            }
        }
        return dsList;
    }

    public BrtcDatasources getDatasourceInfo(String datasourceName) {
        BrtcDatasources brtcDatasources = brtcDatasourcesRepository.findOne(datasourceName);
        ValidationUtil.throwIfEmpty(brtcDatasources, "datasource");
        return brtcDatasources;
    }

    public void insertDatasource(BrtcDatasources brtcDatasources) {
        if(brtcDatasourcesRepository.exists(brtcDatasources.getDatasourceName())){
            throw new BrighticsCoreException("3002", "datasource name");
        }
        brtcDatasourcesRepository.save(brtcDatasources);
    }

    public void updateDatasource(BrtcDatasources brtcDatasources) {
        brtcDatasourcesRepository.save(brtcDatasources);
    }

    public void deleteDatasource(String datasourceName) {
        if (brtcDatasourcesRepository.exists(datasourceName)) {
            brtcDatasourcesRepository.delete(datasourceName);
        } else {
        	throw new BrighticsCoreException("3002", "datasource name");
        }
    }
}
