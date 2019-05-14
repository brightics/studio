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

package com.samsung.sds.brightics.agent.network.receiver;

import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.service.MetaDataService;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.MetaDataServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage;

import io.grpc.stub.StreamObserver;

public class MetaDataReceiver extends MetaDataServiceGrpc.MetaDataServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(MetaDataReceiver.class);
    private static final String USER = "user";
    private final ReceiveMessageListener listener;

	public MetaDataReceiver(ReceiveMessageListener listener) {
		this.listener = listener;
	}
	
	@Override
	public void dataStatusList(DataStatusListMessage request, StreamObserver<ResultDataMessage> responseObserver) {
		String key = listener.receive(request);
        ThreadLocalContext.put(USER, request.getUser());
		logger.info("[Data receiver] receive data status list : " + request.toString() + ", user : " + request.getUser());
		
		ResultDataMessage resultMessage = MetaDataService.getDataStatusList(request);
		responseObserver.onNext(resultMessage);
		responseObserver.onCompleted();

		listener.onCompleted(key);
	}
	
	@Override
	public void manipulateData(ExecuteDataMessage request, StreamObserver<ResultDataMessage> responseObserver) {
		String key = listener.receive(request);
		ThreadLocalContext.put(USER, request.getUser());
		logger.info("[Data receiver] receive view data : " + request.toString() + ", user : " + request.getUser());
		ResultDataMessage resultMessage = MetaDataService.manipulateData(request);
		responseObserver.onNext(resultMessage);
		responseObserver.onCompleted();

		listener.onCompleted(key);
	}
	
	@Override
	public void manipulateImportData(ImportDataMessage request, StreamObserver<ResultDataMessage> responseObserver) {
		String key = listener.receive(request);
		ThreadLocalContext.put(USER, request.getUser());
		logger.info("[Data receiver] receive import data : " + request.toString() + ", user : " + request.getUser());
		ResultDataMessage resultMessage = MetaDataService.manipulateImportData(request);
		responseObserver.onNext(resultMessage);
		responseObserver.onCompleted();

		listener.onCompleted(key);
	}

	@Override
	public void sqlData(ExecuteSqlMessage request, StreamObserver<ResultDataMessage> responseObserver) {
		String key = listener.receive(request);

		ThreadLocalContext.put(USER, request.getUser());
		logger.info("[Data receiver] receive sql data : " + request.toString() + ", user : " + request.getUser());
		ResultDataMessage resultMessage = MetaDataService.sqlData(request);
		responseObserver.onNext(resultMessage);
		responseObserver.onCompleted();

		listener.onCompleted(key);
	}
	
	@Override
	public void addDataAlias(DataAliasMessage request, StreamObserver<ResultDataMessage> responseObserver) {
		String key = listener.receive(request);

		ThreadLocalContext.put(USER, request.getUser());
		logger.info("[Data receiver] receive add data alias : " + request.toString() + ", user : " + request.getUser());
		responseObserver.onNext(MetaDataService.addDataAlias(request));
		responseObserver.onCompleted();

		listener.onCompleted(key);
	}

    @Override
    public void changeDataPermission(DataPermissionMessage request, StreamObserver<ResultDataMessage> responseObserver) {
        String key = listener.receive(request);

        ThreadLocalContext.put(USER, request.getUser());
        logger.info("[Data receiver] change data status permissions : " + request.toString());
        ResultDataMessage resultMessage = MetaDataService.updateDataStatusPermissions(request);
        responseObserver.onNext(resultMessage);
        responseObserver.onCompleted();

        listener.onCompleted(key);
    }

    @Override
    public void addDataAliasByDataKey(DataAliasByDataKeyMessage request, StreamObserver<ResultDataMessage> responseObserver) {
        String key = listener.receive(request);

        ThreadLocalContext.put(USER, request.getUser());
        logger.info("[Data receiver] receive add data alias by dataKey : " + request.toString() + ", user : " + request.getUser());
        responseObserver.onNext(MetaDataService.addDataAliasByDataKey(request));
        responseObserver.onCompleted();

        listener.onCompleted(key);
    }

    @Override
    public void removeDataAlias(RemoveDataAliasMessage request, StreamObserver<ResultDataMessage> responseObserver) {
        String key = listener.receive(request);

        ThreadLocalContext.put(USER, request.getUser());
        logger.info("[Data receiver] receive add data alias by dataKey : " + request.toString() + ", user : " + request.getUser());
        responseObserver.onNext(MetaDataService.removeDataAlias(request));
        responseObserver.onCompleted();

        listener.onCompleted(key);
    }
}
