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

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.util.ThreadUtil;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.client.FileClient;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;
import com.samsung.sds.brightics.common.network.proto.ContextType;

import net.jodah.expiringmap.ExpirationListener;
import net.jodah.expiringmap.ExpirationPolicy;
import net.jodah.expiringmap.ExpiringMap;

@SuppressWarnings("unchecked")
public class ContextManager {

    private static final Logger logger = LoggerFactory.getLogger(ContextManager.class);

    private static final String defaultRunnerPackage = "com.samsung.sds.brightics.agent.context";

    private static Map<ContextType, Class<? extends AbstractContext>> contextClassByType = new ConcurrentHashMap<>();
    //    private static Map<String, UserContextSession> userContextSessions = new ConcurrentHashMap<>();
    private static ExpiringMap<String, UserContextSession> userContextSessions = ExpiringMap.builder()
            .expirationPolicy(ExpirationPolicy.ACCESSED)
            .expiration(Long.parseLong(SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_SESSION_EXPIRATION", "brightics.session.expiration","43200")), TimeUnit.SECONDS)
            .expirationListener(new ExpirationListener<String, UserContextSession>() {
                public void expired(String user, UserContextSession userContextSession) {
                    ThreadLocalContext.put("user", user);
                    userContextSession.closeContexts();
                };
            }).build();

    private static class Lock {}

    private static final Lock lock = new Lock();

    static {

        Set<Class<?>> classes;
        try {
            Reflections reflections = new Reflections(defaultRunnerPackage);
            classes = reflections.getTypesAnnotatedWith(ScriptContext.class);
            for (Class<?> clazz : classes) {
                ScriptContext annotation = clazz.getAnnotation(ScriptContext.class);
                if (annotation != null) {
                    contextClassByType.put(annotation.contextType(), (Class<? extends AbstractContext>) clazz);
                    logger.info("Success to regist '{}'.", clazz.getName());
                }
            }
            logger.info("Finish to initialize script context classes.");
        } catch (Exception e) {
            logger.error("Cannot initialize context", e);
            throw new BrighticsCoreException("3207");
        }
    }

    public static AbstractContext getRunnerAsContext(ContextType contextType, String user) throws Exception {
        if (!contextClassByType.containsKey(contextType)) {
            throw new BrighticsCoreException("3009", contextType.toString());
        }

        if (!userContextSessions.containsKey(user)) {
            userContextSessions.put(user, UserContextSessionLoader.loadUserContextSession(user));
        }

        logger.info("Try to get {} context for {} session ", contextType, user);
        synchronized (lock) {
            UserContextSession userContextSession = userContextSessions.get(user);
            if (!userContextSession.containsContext(contextType)) {
                logger.info("Create new {} context.", contextType);
                AbstractContext someContext = contextClassByType.get(contextType).getConstructor(String.class)
                        .newInstance(user);
                someContext.init();
                someContext.initDataMap();
                userContextSession.putContext(contextType, someContext);
            }
            return userContextSession.getContext(contextType);
        }
    }

    public static AbstractContext getCurrentRunnerAsContext(ContextType contextType) throws Exception {
        return getRunnerAsContext(contextType, ThreadUtil.getCurrentUser());
    }

    public static UserContextSession getCurrentUserContextSession() {
        String user = ThreadUtil.getCurrentUser();
        return getUserContextSession(user);
    }

    public static UserContextSession getUserContextSession(String user) {
        if (!userContextSessions.containsKey(user)) {
            userContextSessions.put(user, UserContextSessionLoader.loadUserContextSession(user));
        }
        return userContextSessions.get(user);
    }

    public static void addDataAlias(String alias, String targetKey) {
        getCurrentUserContextSession().addDataLink(alias, targetKey);
    }

    public static DataStatus getDataStatusAsKey(String key) {
        UserContextSession session = getCurrentUserContextSession();
        String dataKey = session.getLink(key);
        return session.getDataStatus(dataKey);
    }

    public static void updateCurrentDataStatus(String key, DataStatus status) {
        UserContextSession session = getCurrentUserContextSession();
        session.addDataStatus(key, status);
    }

    public static void updateUserDataStatus(String user, String key, DataStatus status) {
        UserContextSession session = getUserContextSession(user);
        session.addDataStatus(key, status);
    }

    public static boolean deleteCurrentDataStatus(String key) throws Exception {
        UserContextSession session = getCurrentUserContextSession();
        return deleteDataStatus(key, session);
    }

    public static boolean deleteUserDataStatus(String user, String key) throws Exception {
        UserContextSession session = getUserContextSession(user);
        return deleteDataStatus(key, session);
    }

    private static boolean deleteDataStatus(String key, UserContextSession session) throws Exception {
        DataStatus ds = session.removeDataStatus(key);
        if (ds != null) {
            ContextType contextType = ds.contextType;
            if (contextType == ContextType.FILESYSTEM) {
                return FileClient.delete(ds.path);
            } else if (contextType == ContextType.KV_STORE) {
                return KVStoreClient.getInstance().delete(key) > 0;
            } else {
                // TODO delegate here to each contexts.
                return getCurrentRunnerAsContext(contextType).removeData(key);
            }
        } else {
            return false;
        }
    }
}
