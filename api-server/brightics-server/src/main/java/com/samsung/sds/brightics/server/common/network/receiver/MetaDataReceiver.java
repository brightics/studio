package com.samsung.sds.brightics.server.common.network.receiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.proto.metadata.MetaDataServiceGrpc;

public class MetaDataReceiver extends MetaDataServiceGrpc.MetaDataServiceImplBase {
	
	private static final Logger logger = LoggerFactory.getLogger(MetaDataReceiver.class);
	
}
