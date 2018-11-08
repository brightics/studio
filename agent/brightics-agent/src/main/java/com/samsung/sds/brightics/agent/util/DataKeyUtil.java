package com.samsung.sds.brightics.agent.util;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

public class DataKeyUtil {

    /**
     * The data key is created by combining the user and mid, tid.
     *
     * @param mid model id
     * @param tid table id
     * @return data key
     */
    public static String createDataKey(String mid, String tid) {
        validateId(mid, "mid");
        validateId(tid, "tid");

        return Stream.of(ThreadUtil.getCurrentUser(), mid, tid).collect(Collectors.joining("/", "/", ""));
    }

    private static void validateId(String id, String idName) {
        if (StringUtils.isEmpty(id) || id.contains("..") || id.contains("/")) {
            throw new BrighticsCoreException("3102", String.format("Invalid %s %s", idName, id));
        }
    }

    /**
     * returns true if dataKey is shared data otherwise false
     *
     * @param dataKey data key
     * @return true if dataKey is shared data otherwise false
     */
    public static boolean isSharedDataKey(String dataKey) {
        return dataKey != null && dataKey.startsWith("/shared/upload/");
    }

    public static boolean isUploadDataKey(String dataKey) {
        return dataKey != null && dataKey.matches("^.+/upload/.+$");
    }

    public static String getUserFrom(String dataKey) {
        return getUserFrom(dataKey, ThreadUtil.getCurrentUser());
    }

    public static String getUserFrom(String dataKey, String defaultUser) {
        if (StringUtils.isEmpty(dataKey)) {
            throw new BrighticsCoreException("3102", String.format("Invalid %s %s", "dataKey", dataKey));
        } else if (isSharedDataKey(dataKey)) {
            return defaultUser;
        }
        // dataKey pattern : /{user}/{mid}/{tid}
        return dataKey.split("/")[1];
    }

    /**
     * get file path that contain root path.
     *
     * @param dataKey key
     * @return path contain data root
     */
    public static String getAbsolutePathByDataKey(String dataKey) {
        return SystemEnvUtil.BRIGHTICS_DATA_ROOT + dataKey;
    }

    /**
     * when file move, copy, import, upload. create new data status contain path.
     *
     * @param key data key
     * @param path path where table data stored
     * @return DataStatus
     */
    public static DataStatus getFirstWriteDataStatus(String key, String path) {
        DataStatus dataStatus = new DataStatus("table", ContextType.FILESYSTEM);
        dataStatus.key = key;
        dataStatus.path = path;
        return dataStatus;
    }
}
