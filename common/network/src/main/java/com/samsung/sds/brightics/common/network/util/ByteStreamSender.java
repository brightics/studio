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

package com.samsung.sds.brightics.common.network.util;

import java.io.Closeable;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

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

	public ByteStreamSender(StreamObserver<ByteStreamMessage> responseObserver, String tempKey,
							ArrayBlockingQueue<Boolean> writeQueue) {
		this.so = responseObserver;
		this.tempKey = tempKey;
		this.writeQueue = writeQueue;
	}

	public void addLineToBuffer(String data) {
		try {
			byte[] dataBytes = data.getBytes("UTF-8");
			send(dataBytes);
		} catch (UnsupportedEncodingException e) {
			logger.error("cannot get byte", e);
		}
	}

	public void send(byte[] data) {
		final int dataLength = data.length;

		final int newSize = itemBuffer.position() + dataLength;
		if (newSize >= NetworkServer.MAXIMUM_BYTESTREAM_SIZE) {
			if (writeQueue != null) {
				try {
					if(writeQueue.remainingCapacity() == 0) logger.debug("Wait for the client to write already sent buffers.");
					int transmissionTime = NetworkServer.MAXIMUM_BYTESTREAM_SIZE * 2 / (1024 * 1024);
					boolean valid = writeQueue.offer(true, transmissionTime, TimeUnit.SECONDS);
					if (!valid) {
						throw new BrighticsCoreException("3102",
								"Data chunk(" + NetworkServer.MAXIMUM_BYTESTREAM_SIZE / (1024 * 1024)
										+ "M) transmission time(" + transmissionTime + ") exceeded.");
					}
				} catch (InterruptedException e) {
					logger.warn("[Common network] fail to manage write job queue.", e);
				}
			}
			sendData();
		}

		if(dataLength>NetworkServer.MAXIMUM_BYTESTREAM_SIZE)

		{
			// Size of single row exceeds maximum size
			throw new BrighticsCoreException("4410");
		}itemBuffer.put(data);pendingItems++;}

	private static final Logger logger = LoggerFactory.getLogger(ByteStreamSender.class);

	private void sendData() {
		if (itemBuffer.position() == 0) {
			return;
		}
		itemBuffer.flip();
		int length = itemBuffer.limit();
		byte[] data = new byte[length];
		itemBuffer.get(data);
		so.onNext(ByteStreamMessage.newBuilder().setTempKey(tempKey).setData(ByteString.copyFrom(data)).build());
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
