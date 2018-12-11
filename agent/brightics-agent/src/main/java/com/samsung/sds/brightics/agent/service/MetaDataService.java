package com.samsung.sds.brightics.agent.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.Any;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.agent.util.ThreadUtil;
import com.samsung.sds.brightics.common.core.acl.Permission;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil.JsonParam;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.client.FileClient;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;
import com.samsung.sds.brightics.common.data.client.ParquetClient;
import com.samsung.sds.brightics.common.data.view.DataViewJson;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.FailResult.Builder;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataKey;
import com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusType;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage.DataActionType;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage.ImportActionType;
import com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage;


public class MetaDataService {

    private static final Logger logger = LoggerFactory.getLogger(MetaDataService.class);

    private static ResultDataMessage moveData(ExecuteDataMessage request) {
        String source = null;
        String targetKey = null;
        try {
            DataStatus ds = ContextManager.getDataStatusAsKey(request.getKey());
            JsonParam params = JsonUtil.jsonToParam(request.getParameters());
            if (ds.contextType == ContextType.FILESYSTEM) {
                source = ds.path;
                targetKey = params.getOrException("destination");
                String targetPath = DataKeyUtil.getAbsolutePathByDataKey(targetKey);
                if (FileClient.move(source, targetPath)) {
                    ContextManager.deleteCurrentDataStatus(ds.key);
                    ContextManager.updateCurrentDataStatus(targetKey, DataKeyUtil.getFirstWriteDataStatus(targetKey, targetPath));
                    return getSuccessResult(String.format("Success to move %s to %s", source, targetKey));
                } else {
                    logger.error("cannot move data.");
                    return getFailResult(new BrighticsCoreException("5009", source, targetKey));
                }
            } else {
                throw new BrighticsCoreException("5014", request.getKey());
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot move data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot move data.", e);
            return getFailResult(new BrighticsCoreException("5009", source, targetKey).addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static ResultDataMessage copyData(ExecuteDataMessage request) {
        String source = null;
        String targetKey = null;
        try {
            DataStatus ds = ContextManager.getDataStatusAsKey(request.getKey());
            JsonParam params = JsonUtil.jsonToParam(request.getParameters());
            if (ds.contextType == ContextType.FILESYSTEM) {
                source = ds.path;
                targetKey = params.getOrException("destination");
                String targetPath = DataKeyUtil.getAbsolutePathByDataKey(targetKey);
                if (FileClient.copy(source, targetPath)) {
                    ContextManager.updateCurrentDataStatus(targetKey, DataKeyUtil.getFirstWriteDataStatus(targetKey, targetPath));
                    return getSuccessResult(String.format("Success to copy %s to %s", source, targetKey));
                } else {
                    logger.error("cannot copy data.");
                    return getFailResult(new BrighticsCoreException("5008", source, targetKey));
                }
            } else {
                throw new BrighticsCoreException("5013", request.getKey());
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot copy data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot copy data.", e);
            return getFailResult(new BrighticsCoreException("5008", source, targetKey).addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static ResultDataMessage importData(ImportDataMessage request) {
        try {
            JsonParam jsonToParam = JsonUtil.jsonToParam(request.getParameters());
            String remotePath = jsonToParam.getOrException("remotePath");
            String targetKey = jsonToParam.getOrException("destination");
            String targetPath = DataKeyUtil.getAbsolutePathByDataKey(targetKey);
            String delimiter = jsonToParam.getOrException("delimiter");
            String columnname = jsonToParam.getOrException("columnname");
            String columntype = jsonToParam.getOrException("columntype");
            InputStream in = FileClient.open(remotePath);
            ParquetClient.writeCsvToParquet(in, delimiter, columnname, columntype, 10, targetPath, true, true);
            ContextManager.updateCurrentDataStatus(targetKey, DataKeyUtil.getFirstWriteDataStatus(targetKey, targetPath));
            return getSuccessResult(String.format("Success to import %s to %s", remotePath, targetKey));
        } catch (AbsBrighticsException e) {
            logger.error("cannot import data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot import data.", e);
            return getFailResult(new BrighticsCoreException("5010").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static ResultDataMessage getRemoteData(ImportDataMessage request) {
        try {
            JsonParam jsonToParam = JsonUtil.jsonToParam(request.getParameters());
            String remotePath = jsonToParam.getOrException("remotePath");
            long limit = jsonToParam.getOrDefault("limit", 100L).longValue();
            InputStream in = FileClient.open(remotePath);
            BufferedReader br = new BufferedReader(new InputStreamReader(in));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < limit; i++) {
                sb.append(br.readLine());
                if (i < limit - 1) {
                    sb.append("\n");
                }
            }
            return getSuccessResult(sb.toString());
        } catch (AbsBrighticsException e) {
            logger.error("cannot get remote data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot get remote data.", e);
            return getFailResult(new BrighticsCoreException("5011").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * get data list by request user.
     * TABLE -> get file system and scala context data status list under /{user}/{mid}
     * UPLOAD  -> get data status list that under /{user}/upload and /shared/upload
     */
    public static ResultDataMessage getDataStatusList(DataStatusListMessage request) {
        try {
            DataStatusType dataType = request.getDataType();
            Collection<DataStatus> dataStatusList = ContextManager.getCurrentUserContextSession().getDataStatusList();
            if (dataType == DataStatusType.TABLE) {
                dataStatusList = dataStatusList.stream()
                        .filter(ds -> (ds.contextType == ContextType.FILESYSTEM && ds.path != null
                                && !DataKeyUtil.isUploadDataKey(ds.key)) || ds.contextType == ContextType.SCALA)
                        .collect(Collectors.toList());
            } else if (dataType == DataStatusType.UPLOAD) {
                dataStatusList = dataStatusList.stream().filter(ds -> ds.contextType == ContextType.FILESYSTEM)
                        .filter(ds -> ds.path != null && DataKeyUtil.isUploadDataKey(ds.key)).collect(Collectors.toList());
            }
            List<Map<String, String>> collect = dataStatusList.stream().map(MetaDataService::getDataStatusInfo)
                    .collect(Collectors.toList());
            return getSuccessResult(collect);
        } catch (AbsBrighticsException e) {
            logger.error("cannot get data status list. ");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot get data status list. ", e);
            return getFailResult(new BrighticsCoreException("4406").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static Map<String, String> getDataStatusInfo(DataStatus ds) {
        Map<String, String> map = new HashMap<>();
        map.put("name", ds.label != null ? ds.label : ds.key);
        map.put("key", ds.key);
        map.put("path", ds.key);
        map.put("absolutepath", ds.path);
        map.put("permission", ds.acl.toString());
        map.put("type", ds.contextType.toString());
        return map;
    }

    // remove data
    private static ResultDataMessage removeData(ExecuteDataMessage request) {
        try {
            DataStatus dataStatus = ContextManager.getDataStatusAsKey(request.getKey());
            if (ContextManager.deleteCurrentDataStatus(dataStatus.key)) {
                return getSuccessResult("Success to delete " + dataStatus.key);
            } else {
                return getFailResult(new BrighticsCoreException("5007", dataStatus.key));
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot remove data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot remove data.", e);
            return getFailResult(new BrighticsCoreException("5007").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * view table type data schema information.
     */
    private static ResultDataMessage getSchema(ExecuteDataMessage request) {
        try {
            DataStatus dataStatus = ContextManager.getDataStatusAsKey(request.getKey());
            ContextType contextType = dataStatus.contextType;
            if (contextType == ContextType.FILESYSTEM) {
                return getSuccessResult(ParquetClient.readSchema(dataStatus.path));
            } else if (contextType == ContextType.KV_STORE) {
                return getSuccessResult(DataViewJson.fromRawJsonData(dataStatus.typeName,
                        Optional.ofNullable(KVStoreClient.getInstance().getJsonForClientView(dataStatus.key)).orElseThrow(() -> new BrighticsCoreException("4406"))));
            } else {
                String viewData = ContextManager.getRunnerAsContext(contextType, ThreadUtil.getCurrentUser()).viewSchema(dataStatus.key);
                return getSuccessResult(viewData);
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot get schema.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot get schema.", e);
            return getFailResult(new BrighticsCoreException("4406").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * view context data or file system data.
     */
    private static ResultDataMessage getData(ExecuteDataMessage request) {
        try {
            JsonParam params = JsonUtil.jsonToParam(request.getParameters());
            long min = params.getOrDefault("min", 0L).longValue();
            long max = params.getOrDefault("max", 1000L).longValue();
            String user = ThreadUtil.getCurrentUser();
            DataStatus ds = ContextManager.getCurrentUserContextSession().getDataStatus(request.getKey());
            ContextType contextType = ds.contextType;
            if (contextType == ContextType.FILESYSTEM) {
                return getSuccessResult(ParquetClient.readParquet(ds.path, min, max));
            } else if (contextType == ContextType.KV_STORE) {
                return getSuccessResult(DataViewJson.fromRawJsonData(ds.typeName,
                        Optional.ofNullable(KVStoreClient.getInstance().getJsonForClientView(ds.key)).orElseThrow(() -> new BrighticsCoreException("4406"))));
            } else {
                return getSuccessResult(ContextManager.getRunnerAsContext(contextType, user).viewData(ds.key, min, max));
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot get data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot get data.", e);
            return getFailResult(new BrighticsCoreException("4406").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    public static ResultDataMessage manipulateImportData(ImportDataMessage request) {
        try {
            ImportActionType actionType = request.getActionType();
            if (ImportActionType.IMPORT == actionType) {
                return importData(request);
            } else if (ImportActionType.DATA == actionType) {
                return getRemoteData(request);
            } else {
                logger.error("cannot manipulate import data.");
                return getFailResult(new BrighticsCoreException("3002", "data " + actionType));
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot manipulate import data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot manipulate import data.", e);
            return getFailResult(new BrighticsCoreException("4406").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    public static ResultDataMessage manipulateData(ExecuteDataMessage request) {
        try {
            DataActionType actionType = request.getActionType();
            if (DataActionType.DATA == actionType) {
                return getData(request);
            } else if (DataActionType.SCHEMA == actionType) {
                return getSchema(request);
            } else if (DataActionType.COPY == actionType) {
                return copyData(request);
            } else if (DataActionType.MOVE == actionType) {
                return moveData(request);
            } else if (DataActionType.DELETE == actionType) {
                return removeData(request);
            } else {
                logger.error("cannot manipulate data.");
                return getFailResult(new BrighticsCoreException("3002", "data " + actionType));
            }
        } catch (AbsBrighticsException e) {
            logger.error("cannot manipulate data.");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot manipulate data.", e);
            return getFailResult(new BrighticsCoreException("4406").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * execute query to scala context data or file system data.
     * if agent do not support spark. cannot execute query.
     */
    public static ResultDataMessage sqlData(ExecuteSqlMessage request) {
        if (!SystemEnvUtil.IS_SPARK_USE) {
            return getFailResult(new BrighticsCoreException("4407", "spark is required to run the query."));
        }
        try {
            String viewData = ContextManager.getRunnerAsContext(ContextType.SCALA, ThreadUtil.getCurrentUser()).sqlData(request);
            return getSuccessResult(viewData);
        } catch (AbsBrighticsException e) {
            logger.error("cannot execute query");
            return getFailResult(e);
        } catch (Throwable e) {
            logger.error("cannot execute query", e);
            return getFailResult(new BrighticsCoreException("4407", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * add mapping information about sources data key and alias data name.
     */
    public static ResultDataMessage addDataAlias(DataAliasMessage request) {
        try {
            String sourceDataKey = DataKeyUtil.createDataKey(request.getMid(), request.getSourceTid());
            String aliasDataKey = DataKeyUtil.createDataKey(request.getMid(), request.getAliasTid());
            ContextManager.getCurrentUserContextSession().addDataLink(aliasDataKey, sourceDataKey);
            return getSuccessResult("1");
        } catch (AbsBrighticsException e) {
            return getFailResult(e);
        }
    }

    private static ResultDataMessage getSuccessResult(Object result) {
        try {
            return getSuccessResult(JsonUtil.toJson(result));
        } catch (Throwable e) {
            logger.error("error in processing json", e);
            return getFailResult(new BrighticsCoreException("3102", "error in processing json").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static ResultDataMessage getSuccessResult(String result) {
        SuccessResult build = SuccessResult.newBuilder()
                .setResult(result)
                .build();
        return ResultDataMessage.newBuilder()
                .setMessageStatus(MessageStatus.SUCCESS)
                .setResult(Any.pack(build))
                .build();
    }

    private static ResultDataMessage getFailResult(AbsBrighticsException e) {
        logger.error("[Meta data detail error message]", e);
        Builder failResult = FailResult.newBuilder()
                .setMessage(e.getMessage());
        if (StringUtils.isNoneBlank(e.detailedCause)) {
            failResult.setDetailMessage(e.detailedCause);
        }
        return ResultDataMessage.newBuilder()
                .setMessageStatus(MessageStatus.FAIL)
                .setResult(Any.pack(failResult.build()))
                .build();
    }

    public static ResultDataMessage updateDataStatusPermissions(DataPermissionMessage request) {
        try {
            List<String> targets = new ArrayList<>();
            for (DataKey target : request.getTargetList()) {
                String dataKey = DataKeyUtil.createDataKey(target.getMid(), target.getTid());
                targets.add(dataKey);
            }

            Map<String, String> result = ContextManager.getCurrentUserContextSession()
                    .updatePermissions(Permission.valueOf(request.getPermission().toUpperCase()), targets.toArray(new String[]{}));

            return getSuccessResult(result);
        } catch (AbsBrighticsException e) {
            logger.error("cannot update data status permissions.");
            return getFailResult(e);
        }
    }

    /**
     * add data link to thread user's UserContextSession
     *
     * @param request request message
     */
    public static ResultDataMessage addDataAliasByDataKey(DataAliasByDataKeyMessage request) {
        try {
            String sourceOwner = DataKeyUtil.getUserFrom(request.getSourceDataKey());
            // try to access source data status. If there is no exception, thread user has access to source data
            ContextManager.getUserContextSession(sourceOwner).getDataStatus(request.getSourceDataKey());
            ContextManager.getCurrentUserContextSession().addDataLink(request.getAliasDataKey(), request.getSourceDataKey());
            return getSuccessResult("1");
        } catch (AbsBrighticsException e) {
            return getFailResult(e);
        }
    }

    public static ResultDataMessage removeDataAlias(RemoveDataAliasMessage request) {
        try {
            int removedCnt = 0;
            for (String aliasDataKey : request.getAliasDataKeyList()) {
                removedCnt += ContextManager.getCurrentUserContextSession().removeDataLink(aliasDataKey) ? 1 : 0;
            }
            return getSuccessResult(String.valueOf(removedCnt));
        } catch (AbsBrighticsException e) {
            return getFailResult(e);
        }
    }
}
