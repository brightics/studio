package com.samsung.sds.brightics.agent.context;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.agent.util.MapUtil;
import com.samsung.sds.brightics.agent.util.ThreadUtil;
import com.samsung.sds.brightics.common.core.acl.Permission;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;

import lombok.Getter;

public class UserContextSession implements Serializable {

    private static final long serialVersionUID = -3347175498518796807L;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserContextSession.class);

    private final transient ConcurrentHashMap<ContextType, AbstractContext> contexts = new ConcurrentHashMap<>(3);
    @Getter
    private final ConcurrentHashMap<String, String> dataLinks = new ConcurrentHashMap<>();
    @Getter
    private final ConcurrentHashMap<String, DataStatus> dataStatuses = new ConcurrentHashMap<>();
    @Getter
    private String user;

    private UserContextSession() {
        /* empty constructor for ObjectMapper deserialization */
    }

    public UserContextSession(String user) {
        this();
        this.user = user;
    }

    public String getLink(String linkOrKey) {
        LinkedHashSet<String> linkInfo = new LinkedHashSet<>(Collections.singletonList(linkOrKey));

        String dataKey = linkOrKey;
        int loopStackCount = 0;
        while (dataLinks.containsKey(dataKey)) {
            dataKey = dataLinks.get(dataKey);
            loopStackCount++;
            if (linkInfo.contains(dataKey)) {
                throw new BrighticsCoreException("5012", String.join(" -> ", linkInfo) + " -> " + dataKey);
            } else if (loopStackCount > 10000) {
                throw new BrighticsCoreException("5003", linkOrKey);
            }
            linkInfo.add(dataKey);
        }
        return dataKey;
    }

    public void addDataLink(String aliasDataKey, String sourceDataKey) {
        dataLinks.put(aliasDataKey, sourceDataKey);
        saveSession();
    }

    /**
     * remove aliasDataKey from dataLinks.
     *
     * @param aliasDataKey alias data key
     * @return true if removed from dataLinks, or false
     */
    public boolean removeDataLink(String aliasDataKey) {
        if (dataLinks.remove(aliasDataKey) != null) {
            saveSession();
            return true;
        }
        return false;
    }

    public DataStatus getDataStatus(String linkOrKey) {
        String dataKey = getLink(linkOrKey);

        // When dataKey's owner is other user, get dataStatus through data owner's UserContextSession
        if (!user.equals(DataKeyUtil.getUserFrom(dataKey, user))) {
            return ContextManager.getUserContextSession(DataKeyUtil.getUserFrom(dataKey)).getDataStatus(dataKey);
        }

        if (!dataStatuses.containsKey(dataKey)) {
            UserContextSessionLoader.refreshData(this);
        }

        if (!dataStatuses.containsKey(dataKey)) {
            if (!Objects.equals(linkOrKey, dataKey)) {
                MapUtil.removeByValue(dataLinks, dataKey);
                saveSession();
            }
            throw new BrighticsCoreException("4342", dataKey);
        }

        // verify access control
        if (!DataKeyUtil.isSharedDataKey(dataKey) && !user.equals(ThreadUtil.getCurrentUser()) && dataStatuses.get(dataKey).acl != Permission.PUBLIC) {
            throw new BrighticsCoreException("4346", dataKey);
        }

        return dataStatuses.get(dataKey);
    }

    @JsonIgnore
    public Collection<DataStatus> getDataStatusList() {
        UserContextSessionLoader.refreshData(this);
        return dataStatuses.values();
    }

    public void addDataStatus(String dataKey, DataStatus status) {
        addDataStatus(dataKey, status, true);
    }

    private void addDataStatus(String dataKey, DataStatus status, boolean saveObject) {
        dataStatuses.put(dataKey, status);
        if (saveObject) {
            saveSession();
        }
    }

    public void addDataStatuses(Map<String, DataStatus> statuses) {
        for (Entry<String, DataStatus> entry : statuses.entrySet()) {
            addDataStatus(entry.getKey(), entry.getValue(), false);
        }
        saveSession();
    }

    public DataStatus removeDataStatus(String dataKey) {
        DataStatus result = dataStatuses.remove(dataKey);
        if (result != null) {
            MapUtil.removeByValue(dataLinks, dataKey);
            saveSession();
        }
        return result;
    }

    public boolean containsContext(ContextType contextType) {
        return contexts.containsKey(contextType);
    }

    public void putContext(ContextType contextType, AbstractContext context) {
        contexts.put(contextType, context);
    }

    public AbstractContext getContext(ContextType contextType) {
        return contexts.get(contextType);
    }

    public void closeContext(ContextType contextType) {
        contexts.get(contextType).close();
    }

    public void closeContexts() {
        for (AbstractContext context : contexts.values()) {
            context.close();
        }
    }

    public Map<String, String> updatePermissions(Permission permission, String... dataKeys) {
        Map<String, String> result = new HashMap<>();
        for (String dataKey : dataKeys) {
            getDataStatus(dataKey).acl = permission;
            result.put(dataKey, permission.name());
        }
        saveSession();
        return result;
    }

    private void saveSession() {
        if (user == null || user.isEmpty()) {
            throw new BrighticsCoreException("3102", "UserContextSession.user is empty");
        }

        try {
            if (ThreadUtil.getCurrentUser().equals(user)) {
                UserContextSessionLoader.saveUserContextSession(user, this);
            }
        } catch (AbsBrighticsException e) {
            LOGGER.debug("failed to save UserContextSession.");
        }
    }
}
