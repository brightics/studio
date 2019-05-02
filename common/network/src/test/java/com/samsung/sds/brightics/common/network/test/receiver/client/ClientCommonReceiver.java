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

package com.samsung.sds.brightics.common.network.test.receiver.client;

import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;

import io.grpc.stub.StreamObserver;

public class ClientCommonReceiver extends CommonServiceGrpc.CommonServiceImplBase {

	@Override
	public void receiveHeartbeat(HeartbeatMessage request, StreamObserver<HeartbeatMessage> responseObserver) {
	    responseObserver.onNext(request);
	    responseObserver.onCompleted();
	}
}
