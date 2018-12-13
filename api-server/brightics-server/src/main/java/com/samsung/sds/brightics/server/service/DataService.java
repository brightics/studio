package com.samsung.sds.brightics.server.service;

import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.base.Joiner;
import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.BrighticsUncodedException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataKey;
import com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusType;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage.DataActionType;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage.ImportActionType;
import com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;
import com.samsung.sds.brightics.common.network.util.ParameterBuilder;
import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.model.param.DataLinkParam;
import com.samsung.sds.brightics.server.model.param.DataLinkParam.DataLink;
import com.samsung.sds.brightics.server.model.param.DataPermissionParam;
import com.samsung.sds.brightics.server.model.param.DataPermissionParam.TargetDataKey;
import com.samsung.sds.brightics.server.model.param.FileRepositoryParam;
import com.samsung.sds.brightics.server.model.param.GroupDataParam;

/**
 * This class of service manages the data from agent context(scala, python) or
 * file system, redis. The data information is stored in the agent.
 *
 * @author hk.im
 */
@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    @Autowired
    MessageManagerProvider messageManagerProvider;

    private String getDataKey(String mid, String tid) {
        return "/" + AuthenticationUtil.getRequestUserId()
            + "/" + mid + "/" + tid;
    }

    /**
     * get data list by request user.
     *
     * @param type DataStatusType (TABLE, UPLOAD)
     */
    public Object getDataStatusList(DataStatusType type) {
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendDataStatusList(DataStatusListMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setDataType(type).build());
        return dataResultParser(result);
    }

    /**
     * Retrieves the contents of the stored data.
     *
     * @param mid model id
     * @param tid source data name(tid)
     * @param min 0-base minimum row number(inclusive)
     * @param max 0-base maximum row number(exclusive)
     */
    public Object getData(String mid, String tid, long min, long max) {
        return getData(getDataKey(mid, tid), min, max);
    }

    /**
     * Retrieves the contents of the stored data.
     *
     * @param key data key
     * @param min minimum row number
     * @param max maximum row number
     */
    public Object getData(String key, long min, long max) {
        String param = ParameterBuilder.newBuild().addProperty("min", min).addProperty("max", max).build();
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateData(ExecuteDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(DataActionType.DATA).setKey(key).setParameters(param).build());
        return dataResultParser(result);
    }

    /**
     * remove stored data.
     *
     * @param key data key
     */
    public void removeData(String key) {
        messageManagerProvider.metadataManager()
            .sendManipulateData(ExecuteDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(DataActionType.DELETE).setKey(key).build());
    }

    /**
     * get column of stored data.
     *
     * @param key data key
     */
    public Object getSchema(String key) {
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateData(ExecuteDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(DataActionType.SCHEMA).setKey(key).build());
        return dataResultParser(result);
    }


    public Object viewGroup(GroupDataParam groupDataParam) {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * move data
     *
     * @param repoParam source & destination information
     */
    public void moveData(FileRepositoryParam repoParam) {
        filePathValidator(repoParam.getDestination());
        String param = ParameterBuilder.newBuild().addProperty("destination", repoParam.getDestination()).build();
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateData(ExecuteDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(DataActionType.MOVE).setKey(repoParam.getSource()).setParameters(param).build());
        dataResultParser(result);
    }

    /**
     * copy data
     *
     * @param repoParam source & destination information
     */
    public void copyData(FileRepositoryParam repoParam) {
        filePathValidator(repoParam.getDestination());
        String param = ParameterBuilder.newBuild().addProperty("destination", repoParam.getDestination()).build();
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateData(ExecuteDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(DataActionType.COPY).setKey(repoParam.getSource()).setParameters(param).build());
        dataResultParser(result);
    }

    /**
     * upload file to brightics file repository.
     * file type is csv
     *
     * @param inputstream input stream
     * @param path file	upload path
     * @param delimiter column delimiter
     * @param columnTypeJson column type json
     * @param columnNameJson column type json (optional)
     */
    public void fileUpload(InputStream inputstream, String path, String delimiter, String columnTypeJson, String columnNameJson) {
        filePathValidator(path); 
        String param = ParameterBuilder.newBuild()
                .addProperty("delimiter", delimiter)
                .addProperty("columntype", toCommaDelimitedString(columnTypeJson))
                .addProperty("columnname", toCommaDelimitedString(columnNameJson))
                .build();
        WriteMessage writeMessage = WriteMessage.newBuilder().setPath(path).setParameters(param)
            .setUser(AuthenticationUtil.getRequestUserId()).build();
        try {
            messageManagerProvider.streamManager().sendFile(writeMessage, inputstream, true);
        } catch (AbsBrighticsException e) {
            logger.error("Cannot upload file", e);
            throw e;
        } catch (Exception e) {
            logger.error("Cannot upload file", e);
            throw new BrighticsCoreException("3401").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    private String toCommaDelimitedString(String json) {
        return Arrays.stream(JsonUtil.fromJson(json, String[].class))
                .reduce((a, b) -> a + "," + b)
                .orElse("");
    }

    /**
     * download file from brightics file repository
     *
     * @param repoParam object contain path, delimiter, filename
     */
    public void downloadFile(FileRepositoryParam repoParam, HttpServletResponse response) {
        String key = repoParam.getRemotePath();
        String delimiter = repoParam.getDelimiter();
        String filename = repoParam.getFilename();
        ReadMessage readMessage = ReadMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId()).setKey(key)
            .setDelimiter(delimiter).build();
        try {
            String encodeFileName = URLEncoder.encode(filename, "UTF-8");
            response.setContentType("application/octet-stream");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + encodeFileName);
            messageManagerProvider.streamManager().receiveFile(readMessage, response.getOutputStream());
        } catch (AbsBrighticsException e) {
            logger.error("Cannot download file", e);
            throw e;
        } catch (Exception e) {
            logger.error("Cannot download file", e);
            throw new BrighticsCoreException("3402", e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    /**
     * import csv file that locate brightics file repository to brightics file repository
     */
    public void importData(FileRepositoryParam repoParam) {

        String remotePath = repoParam.getInputpath();
        String destination = repoParam.getPath();
        filePathValidator(remotePath, destination);

        String delimiter = repoParam.getDelimiter();
        String[] columntypeAray = repoParam.getColumntype();
        String columntype = Joiner.on(",").join(columntypeAray);
        String[] columnnameAray = repoParam.getColumnname();
        String columnname = Joiner.on(",").join(columnnameAray);
        String param = ParameterBuilder.newBuild().addProperty("remotePath", remotePath)
            .addProperty("destination", destination).addProperty("delimiter", delimiter)
            .addProperty("columntype", columntype).addProperty("columnname", columnname).build();
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateImportData(ImportDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(ImportActionType.IMPORT).setParameters(param).build());
        dataResultParser(result);
    }

    /**
     * Get remote path data.
     */
    public Object getRemotePathData(String remotePath, long limit) {
        filePathValidator(remotePath);
        String param = ParameterBuilder.newBuild().addProperty("remotePath", remotePath)
            .addProperty("limit", limit).build();
        ResultDataMessage result = messageManagerProvider.metadataManager()
            .sendManipulateImportData(ImportDataMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setActionType(ImportActionType.DATA).setParameters(param).build());
        return dataResultParser(result);
    }

    /**
     * Add data table alias for <code>source</code> as <code>alias</code>
     *
     * @param source source data key
     * @param alias alias data key
     */
    public void addDataAlias(String source, String alias) {
        if (source.equals(alias)) {
            return;
        }
        logger.info("[DATA ALIAS] {} is referencing {} now.", alias, source);
        DataAliasByDataKeyMessage message = DataAliasByDataKeyMessage.newBuilder().setSourceDataKey(source).setAliasDataKey(alias)
            .setUser(AuthenticationUtil.getRequestUserId()).build();
        messageManagerProvider.metadataManager().sendDataAliasByDataKey(message);
    }

    private Object dataResultParser(ResultDataMessage result) {
        try {
            if (result.getMessageStatus() == MessageStatus.SUCCESS) {
                return result.getResult().unpack(SuccessResult.class).getResult();
            } else {
                FailResult failResult;
                failResult = result.getResult().unpack(FailResult.class);
                throw new BrighticsUncodedException(failResult.getMessage(), failResult.getDetailMessage());
            }
        } catch (InvalidProtocolBufferException e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }


    private void filePathValidator(String... paths) {
        for (String path : paths) {
            if (path.contains("../")) {
                throw new BrighticsCoreException("3403", "../");
            }
        }
    }

    /**
     * update data permissions
     */
    public Object updatePermissions(DataPermissionParam param) {
        DataPermissionMessage.Builder builder = DataPermissionMessage.newBuilder().setPermission(param.getPermission().toString());
        for (TargetDataKey targetDataKey : param.getDataKeys()) {
            builder.addTarget(DataKey.newBuilder().setMid(targetDataKey.getMid()).setTid(targetDataKey.getTid()).build());
        }
        builder.setUser(AuthenticationUtil.getRequestUserId());
        return ResultMapUtil.success(dataResultParser(messageManagerProvider.metadataManager().sendChangeDataPermission(builder.build())));
    }

    public Object addDataLinks(DataLinkParam dataLinkParam) {
        int resultCnt = 0;

        for (DataLink dataLink : dataLinkParam.getLinks()) {
            if (dataLink.getSource().equals(dataLink.getAlias())) {
                continue;
            }
            DataAliasByDataKeyMessage message = DataAliasByDataKeyMessage.newBuilder()
                .setSourceDataKey(dataLink.getSource())
                .setAliasDataKey(dataLink.getAlias())
                .setUser(AuthenticationUtil.getRequestUserId())
                .build();
            messageManagerProvider.metadataManager().sendDataAliasByDataKey(message);
            resultCnt++;
            logger.info("[DATA ALIAS] {} is referencing {} now.", dataLink.getAlias(), dataLink.getSource());
        }
        return ResultMapUtil.success(resultCnt);
    }

    public Object removeDataLinks(DataLinkParam dataLinkParam) {
        RemoveDataAliasMessage message = RemoveDataAliasMessage.newBuilder()
            .addAllAliasDataKey(dataLinkParam.getLinks().stream().map(DataLink::getAlias).collect(Collectors.toList()))
            .setUser(AuthenticationUtil.getRequestUserId())
            .build();

        return ResultMapUtil.success(dataResultParser(messageManagerProvider.metadataManager().sendRemoveDataAlias(message)));
    }
}
