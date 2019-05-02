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

package com.samsung.sds.brightics.agent.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;

import com.samsung.sds.brightics.agent.util.DBConnectionProvider;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil.JsonParam;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.network.proto.database.ConnectionInfo;
import com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage;
import com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage.DBActionType;

public class DatabaseService {

    private static DBConnectionProvider getConnectionProvider(ExecuteDBMessage request) {
        ConnectionInfo connectionInfo = request.getConnectionInfo();
        return new DBConnectionProvider(connectionInfo.getUrl(), connectionInfo.getUser(), connectionInfo.getPassword(),
                connectionInfo.getDriver());
    }

    public static String getDatabaseInfo(ExecuteDBMessage request) {
        DBConnectionProvider provider = getConnectionProvider(request);
        DBActionType actionType = request.getActionType();
        if (actionType == DBActionType.VAILD) {
            return String.valueOf(DatabaseService.isValid(provider));
        } else if (actionType == DBActionType.SCHEMA) {
            return DatabaseService.getSchemaList(provider);
        } else if (actionType == DBActionType.TABLE) {
            return DatabaseService.getTableList(provider, request);
        } else if (actionType == DBActionType.COLUMN) {
            return DatabaseService.getColumnList(provider, request);
        } else if (actionType == DBActionType.SQL) {
            return DatabaseService.executeSql(provider, request);
        } else {
            throw new BrighticsCoreException("3002", "action type[" + actionType.name() + "]");
        }
    }

    private static boolean isValid(DBConnectionProvider provider) {
        try {
            Connection connection = provider.getConnection();
            return connection.isValid(10);
        } catch (Exception e) {
            throw new BrighticsCoreException("4341", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        } finally {
            provider.stopConnection();
        }
    }

    private static String getSchemaList(DBConnectionProvider provider) {
        try {
            Connection connection = provider.getConnection();
            ResultSet rs = connection.getMetaData().getSchemas();
            List<Map<String, String>> scahems = new ArrayList<>();
            while (rs.next()) {
                Map<String, String> schame = new HashMap<>();
                if (rs.getString(DBConnectionProvider.SCHEMA_SCHEMA_NAME) == null) {
                    if (rs.getString(DBConnectionProvider.SCHEMA_TABLE_CATALOG) == null) {
                        schame.put("schemaName", "");
                    } else {
                        schame.put("schemaName", rs.getString(DBConnectionProvider.SCHEMA_TABLE_CATALOG));
                    }
                } else {
                    schame.put("schemaName", rs.getString(DBConnectionProvider.SCHEMA_SCHEMA_NAME));
                }
                scahems.add(schame);
            }
            return JsonUtil.toJson(scahems);
        } catch (Exception e) {
            throw new BrighticsCoreException("4341", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        } finally {
            provider.stopConnection();
        }
    }

    private static String getTableList(DBConnectionProvider provider, ExecuteDBMessage request) {
        try {
            JsonParam jsonParam = JsonUtil.jsonToParam(request.getParameters());
            String schemaName = jsonParam.getOrDefault("schemaName", "");
            Connection connection = provider.getConnection();
            String[] tableArray = {"TABLE"};
            ResultSet rs = connection.getMetaData().getTables(null, schemaName, null, tableArray);
            List<Map<String, String>> tables = new ArrayList<>();
            while (rs.next()) {
                Map<String, String> table = new HashMap<>();
                table.put("schemaName", rs.getString(DBConnectionProvider.TABLE_SCHEMA_NAME));
                table.put("tableName", rs.getString(DBConnectionProvider.TABLE_TABLE_NAME));
                tables.add(table);
            }
            return JsonUtil.toJson(tables);
        } catch (Exception e) {
            throw new BrighticsCoreException("4341", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        } finally {
            provider.stopConnection();
        }
    }

    private static String getColumnList(DBConnectionProvider provider, ExecuteDBMessage request) {
        try {
            JsonParam jsonParam = JsonUtil.jsonToParam(request.getParameters());
            String schemaName = jsonParam.getOrDefault("schemaName", "");
            String tableName = jsonParam.getOrException("tableName");
            Connection connection = provider.getConnection();
            ResultSet rs = connection.getMetaData().getColumns(null, schemaName, tableName, null);
            List<Map<String, String>> columns = new ArrayList<>();
            while (rs.next()) {
                Map<String, String> column = new HashMap<>();
                column.put("schemaName", rs.getString(DBConnectionProvider.COLUMN_SCHEMA_NAME));
                column.put("tableName", rs.getString(DBConnectionProvider.COLUMN_TABLE_NAME));
                column.put("columnName", rs.getString(DBConnectionProvider.COLUMN_COLUMN_NAME));
                column.put("typeCode", rs.getString(DBConnectionProvider.COLUMN_COLUMN_DATA_TYPE));
                column.put("typeName", rs.getString(DBConnectionProvider.COLUMN_COLUMN_TYPE));
                column.put("nullable", rs.getString(DBConnectionProvider.COLUMN_COLUMN_NULLABLE));
                columns.add(column);
            }
            return JsonUtil.toJson(columns);
        } catch (Exception e) {
            throw new BrighticsCoreException("4341", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        } finally {
            provider.stopConnection();
        }
    }

    private static String executeSql(DBConnectionProvider provider, ExecuteDBMessage request) {
        try {
            JsonParam jsonParam = JsonUtil.jsonToParam(request.getParameters());
            String sql = jsonParam.getOrException("sql");
            int limit = Integer.parseInt(jsonParam.getOrDefault("limit", "1000"));
            Connection connection = provider.getConnection();
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(600);
            ResultSet rs = statement.executeQuery(sql);

            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            List<Map<String, String>> columns = new ArrayList<>();
            for (int i = 1; i <= columnCount; i++) {
                Map<String, String> column = new HashMap<>();
                column.put("name", metaData.getColumnName(i));
                column.put("typeName", metaData.getColumnTypeName(i));
                columns.add(column);
            }

            List<List<String>> data = new ArrayList<>();
            int index = 0;
            while (rs.next() && index < limit) {
                List<String> row = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    String value = rs.getString(i);
                    row.add(value);
                }
                data.add(row);
                index++;
            }

            Map<String, Object> result = new HashMap<>();
            result.put("columns", columns);
            result.put("schema", columns);
            result.put("data", data);
            return JsonUtil.toJson(result);
        } catch (Exception e) {
            throw new BrighticsCoreException("4341", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        } finally {
            provider.stopConnection();
        }
    }

}
