package com.samsung.sds.brightics.common.network.util;

import java.io.Closeable;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.concurrent.ArrayBlockingQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.ByteString;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.server.NetworkServer;

import io.grpc.stub.StreamObserver;

/**
 * This class forwards bytes by the max size of the grpc stream.
 */
public class ByteStreamSender implements Closeable {

	private final StreamObserver<ByteStreamMessage> so;
	private final ByteBuffer itemBuffer = ByteBuffer.allocate(NetworkServer.MAXIMUM_BYTESTREAM_SIZE);
	private final String tempKey;
	private final ArrayBlockingQueue<Boolean> writeQueue;
	private int pendingItems = 0;

	public ByteStreamSender(StreamObserver<ByteStreamMessage> responseObserver, String tempKey) {
	    this.so = responseObserver;
	    this.tempKey = tempKey;
	    this.writeQueue = null;
	}
	
	public ByteStreamSender(StreamObserver<ByteStreamMessage> responseObserver, String tempKey, ArrayBlockingQueue<Boolean> writeQueue) {
		this.so = responseObserver;
		this.tempKey = tempKey;
		this.writeQueue = writeQueue;
	}

	public void addLineToBuffer(String data) {
		try {
			byte[] dataBytes = data.getBytes("UTF-8");
			final int dataLength = dataBytes.length;

			final int newSize = itemBuffer.position() + dataLength;
			if (newSize >= NetworkServer.MAXIMUM_BYTESTREAM_SIZE) {
			    if(writeQueue != null){
    			    try {
    			        if(writeQueue.remainingCapacity() == 0) logger.debug("Wait for the client to write already sent buffers.");
                        writeQueue.put(true);
                    } catch (InterruptedException e) {
                        logger.warn("[Common network] fail to manage write job queue.", e);
                    }
			    }
				sendData();
			}

			if (dataLength > NetworkServer.MAXIMUM_BYTESTREAM_SIZE) {
				// Size of single row exceeds maximum size
				throw new BrighticsCoreException("4410");
			}
			itemBuffer.put(dataBytes);
			pendingItems++;
		} catch (UnsupportedEncodingException e) {
			logger.error("cannot get byte", e);
		}
	}

	private static final Logger logger = LoggerFactory.getLogger(ByteStreamSender.class);
	
	private void sendData() {
		if (itemBuffer.position() == 0) {
			return;
		}
		itemBuffer.flip();
		int length = itemBuffer.limit();
		byte[] data = new byte[length];
		itemBuffer.get(data);
		so.onNext(ByteStreamMessage.newBuilder().setTempKey(tempKey)
				.setData(ByteString.copyFrom(data)).build());
		itemBuffer.clear();
		pendingItems = 0;
	}

	@Override
	public void close() {
		if (pendingItems > 0) {
			sendData();
		}
	}
}
