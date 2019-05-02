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

package com.samsung.sds.brightics.agent.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Locale;

import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DBConnectionProvider {
	
	private static final Logger logger = LoggerFactory.getLogger(DBConnectionProvider.class);

	String url;
	String user;
	String password;
	String driver;

	public static final int SCHEMA_SCHEMA_NAME = 1;
	public static final int SCHEMA_TABLE_CATALOG = 2;
	public static final int TABLE_SCHEMA_NAME = 2;
	public static final int TABLE_TABLE_NAME = 3;
	public static final int COLUMN_SCHEMA_NAME = 2;
	public static final int COLUMN_TABLE_NAME = 3;
	public static final int COLUMN_COLUMN_NAME = 4;
	public static final int COLUMN_COLUMN_DATA_TYPE = 5;
	public static final int COLUMN_COLUMN_TYPE = 6;
	public static final int COLUMN_COLUMN_NULLABLE = 11;
	public Connection connection;

	public DBConnectionProvider(String url, String user, String password, String driver) {
		this.url = url;
		this.user = user;
		this.password = password;
		this.driver = driver;
	}

    public Connection getConnection() throws Exception {
        Class.forName(driver);
        connection = DriverManager.getConnection(url, user, password);
        if (driver.toUpperCase(Locale.ENGLISH).contains("POSTGRE")) {
            connection.createStatement().execute("Set Random_page_cost = 1");
        }
        return connection;
    }

	public void stopConnection() {
		if (connection != null) {
			try {
				connection.close();
			} catch (Exception e) {
				logger.warn("Ignored failure of closing db connection");
			}
		}
	}

}
