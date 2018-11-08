package com.samsung.sds.brightics.common.data;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.data.client.FileClient;
import com.samsung.sds.brightics.common.network.proto.ContextType;

public class DataStatusMapBuilder {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataStatusMapBuilder.class);

    private final String dataRoot;
    private String searchRootPath;
    private boolean hasMidDir = true;

    public DataStatusMapBuilder(String dataRoot) {
        this.dataRoot = dataRoot;
    }

    public DataStatusMapBuilder setSearchRootPath(String searchRootPath) {
        this.searchRootPath = searchRootPath;
        return this;
    }

    public DataStatusMapBuilder setHasMidDir(boolean hasMidDir) {
        this.hasMidDir = hasMidDir;
        return this;
    }

    public Map<String, DataStatus> build() {
        if (searchRootPath == null || searchRootPath.isEmpty()) {
            throw new IllegalArgumentException("rootPath is emtpy");
        }

        Map<String, DataStatus> result = new HashMap<>();
        FileSystem fs = FileClient.getFileSystem();
        try {
            for (FileStatus status : fs.listStatus(new Path(searchRootPath))) {
                if (!status.isDirectory()) {
                    continue;
                }
                result.putAll(getDataStatuses(fs, status.getPath()));
            }
        } catch (IOException e) {
            LOGGER.error("failed to read from {}", searchRootPath);
        }
        return result;
    }

    private Map<String, DataStatus> getDataStatuses(FileSystem fs, Path path) {
        Map<String, DataStatus> map = new HashMap<>();
        try {
            if (hasMidDir) {
                for (FileStatus status : fs.listStatus(path)) {
                    DataStatus dataStatus = new DataStatus("table", ContextType.FILESYSTEM);
                    dataStatus.key = getDataKeyFrom(status.getPath());
                    dataStatus.path = getPathString(status.getPath());
                    map.put(dataStatus.key, dataStatus);
                }
            } else {
                DataStatus dataStatus = new DataStatus("table", ContextType.FILESYSTEM);
                dataStatus.key = getDataKeyFrom(path);
                dataStatus.path = getPathString(path);
                map.put(dataStatus.key, dataStatus);
            }
        } catch (IOException e) {
            LOGGER.error("failed to read data from {}", path, e);
        }
        return map;
    }

    private String getDataKeyFrom(Path sourcePath) {
        String pathString = getPathString(sourcePath);
        if (pathString.startsWith(dataRoot)) {
            return pathString.replaceFirst(dataRoot, "");
        }
        return pathString;
    }

    private String getPathString(Path path) {
        String pathString = path.toUri().getPath();
        if (pathString.matches("/.+:/.*")) {
            // remove leading slash for windows
            pathString = pathString.substring(1);
        }
        return pathString;
    }
}
