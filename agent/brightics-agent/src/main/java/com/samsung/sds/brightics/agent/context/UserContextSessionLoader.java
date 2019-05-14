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

package com.samsung.sds.brightics.agent.context;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.DataStatusMapBuilder;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;

public class UserContextSessionLoader {

    public static UserContextSession loadUserContextSession(String user) {
        UserContextSession session = retrieveSessionDataFromStorage(user);
        // user data status
        session.addDataStatuses(
                new DataStatusMapBuilder(SystemEnvUtil.BRIGHTICS_DATA_ROOT).setSearchRootPath(buildPath(user)).build());
        session.addDataStatuses(
                new DataStatusMapBuilder(SystemEnvUtil.BRIGHTICS_DATA_ROOT).setSearchRootPath(buildPath("shared")).build());

        return session;
    }

    public static void saveUserContextSession(String user, UserContextSession session) {
        String createSessionKey = createSessionKey(user);
		KVStoreClient.getInstance().put(createSessionKey, session);
    }

    //clear user context session info.
    public static void clearUserContextSession(String user) {
    	String createSessionKey = createSessionKey(user);
    	KVStoreClient.getInstance().delete(createSessionKey);
    }

    private static UserContextSession retrieveSessionDataFromStorage(String user) {
        UserContextSession result = KVStoreClient.getInstance().get(createSessionKey(user), UserContextSession.class);
        if (result == null) {
            return new UserContextSession(user);
        }
        return result;
    }

    private static String createSessionKey(String user) {
        return String.join("/", "dataStatus", user);
    }

    static String buildPath(String... paths) {
        if (Arrays.binarySearch(paths, "..") >= 0) {
            throw new BrighticsCoreException("3102", "Relative path is now allowed.");
        }
        Stream<String> newPaths = Stream.of(paths);
        return SystemEnvUtil.BRIGHTICS_DATA_ROOT + newPaths.filter(StringUtils::isNotEmpty).collect(Collectors.joining("/", "/", ""));
    }

    public static void refreshData(UserContextSession session) {
        Map<String, DataStatus> newStatuses = new HashMap<>();
        newStatuses.putAll(new DataStatusMapBuilder(SystemEnvUtil.BRIGHTICS_DATA_ROOT).setSearchRootPath(buildPath(session.getUser())).build());
        newStatuses.putAll(new DataStatusMapBuilder(SystemEnvUtil.BRIGHTICS_DATA_ROOT).setSearchRootPath(buildPath("shared")).build());

        Map<String, DataStatus> dataStatuses = session.getDataStatuses();
        // remove deleted data status
        dataStatuses.entrySet().removeIf(entry -> DataKeyUtil.isUploadDataKey(entry.getKey()) && !newStatuses.containsKey(entry.getKey()));
        // preserve properties for existing data status
        newStatuses.entrySet().stream().filter(entry -> dataStatuses.containsKey(entry.getKey())).forEach(entry -> {
            entry.getValue().copyPreservedProperties(dataStatuses.get(entry.getKey()));
        });

        session.addDataStatuses(newStatuses);
    }
}