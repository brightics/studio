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

package com.samsung.sds.brightics.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.model.entity.BrtcDatasources;
import com.samsung.sds.brightics.server.service.DataSourceService;

@RestController
@RequestMapping("/api/core/v2")
public class DataSourceController {
    @Autowired
    private DataSourceService dataSourceService;
    
    /**
     * GET      /api/core/v2/dbtypes                         : 지원 db type 조회
     * GET      /api/core/v2/datasources                     : datasources 리스트 조회
     * GET      /api/core/v2/datasources/{datasourcesName}   : datasources 조회
     * PUT      /api/core/v2/datasources                     : datasources 등록
     * POST     /api/core/v2/datasources                     : datasources 수정
     * DELETE   /api/core/v2/datasources/{datasourcesName}   : datasources 삭제
     */
    
    @RequestMapping(value = "/dbtypes", method = RequestMethod.GET)
    public Object getDBTyepList() {
        return dataSourceService.getDBTyepList();
    }
    @RequestMapping(value = "/datasources", method = RequestMethod.GET)
    public Object getDatasourcesList() {
        return dataSourceService.getRdbDatasourcesList();
    }
    @RequestMapping(value = "/datasources/{datasourceName:.+}", method = RequestMethod.GET)
    public Object getDatasources(@PathVariable String datasourceName) {
        return dataSourceService.getDatasourceInfo(datasourceName);
    }
    @RequestMapping(value = "/datasources", method = RequestMethod.PUT)
    public void insertDatasource(@RequestBody BrtcDatasources brtcDatasources) {
        dataSourceService.insertDatasource(brtcDatasources);
    }
    @RequestMapping(value = "/datasources", method = RequestMethod.POST)
    public void updateDatasource(@RequestBody BrtcDatasources brtcDatasources) {
        dataSourceService.updateDatasource(brtcDatasources);
    }
    @RequestMapping(value = "/datasources/{datasourceName:.+}", method = RequestMethod.DELETE)
    public void deleteDatasources(@PathVariable String datasourceName) {
        dataSourceService.deleteDatasource(datasourceName);
    }
}
