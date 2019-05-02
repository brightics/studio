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

package com.samsung.sds.brightics.common.data.client.impl;

import java.io.ByteArrayInputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.h2.jdbcx.JdbcConnectionPool;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;

public class H2Client extends KVStoreClient {

    private JdbcConnectionPool pool;

    public H2Client() {
        pool = JdbcConnectionPool.create("jdbc:h2:file:./data/kvs_db", "brightics", "brightics");
        try (Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS BRTC_KV_STORE(ID VARCHAR2(120) PRIMARY KEY, DATA BLOB)");
        } catch (SQLException e) {
            throw new BrighticsCoreException("3102", "failed to initialize H2 client").initCause(e);
        }
    }

    @Override
    protected void putImpl(String key, Object data) {
        try (Connection conn = pool.getConnection();
                PreparedStatement psmt = conn.prepareStatement("MERGE INTO BRTC_KV_STORE KEY (ID) VALUES(?, ?)");) {
            psmt.setString(1, key);
            psmt.setBinaryStream(2, new ByteArrayInputStream(serialize(data)));
            psmt.executeUpdate();
        } catch (Exception e) {
            LOGGER.error("failed to put data to h2", e);
        }
    }

    @Override
    protected <T> T getImpl(String key, Class<T> clazz) {
        try (Connection conn = pool.getConnection();
                PreparedStatement psmt = conn.prepareStatement("SELECT DATA FROM BRTC_KV_STORE WHERE ID = ?")) {
            psmt.setString(1, key);
            psmt.execute();
            ResultSet rs = psmt.getResultSet();
            if (rs.next()) {
                return deserialize(rs.getBytes(1), clazz);
            }
        } catch (Exception e) {
            LOGGER.error("failed to get data from h2", e);
        }
        return null;
    }

    @Override
    protected long deleteImpl(String key) {
        try (Connection conn = pool.getConnection();
                PreparedStatement psmt = conn.prepareStatement("DELETE FROM BRTC_KV_STORE WHERE ID = ?")) {
            psmt.setString(1, key);
            return psmt.executeUpdate();
        } catch (SQLException e) {
            LOGGER.error("failed to delete data from h2", e);
        }
        return 0;
    }
}
