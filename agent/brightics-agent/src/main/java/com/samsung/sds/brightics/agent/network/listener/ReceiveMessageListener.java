package com.samsung.sds.brightics.agent.network.listener;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.AbstractMessage;

public abstract class ReceiveMessageListener {

	private static final Logger logger = LoggerFactory.getLogger(ReceiveMessageListener.class);

	private static Map<String, AbstractMessage> messages = new ConcurrentHashMap<>();

	public String receive(AbstractMessage message) {
		String key = UUID.randomUUID().toString();
		return receiveWithKey(key, message);
	}

	public String receiveWithKey(String key, AbstractMessage message) {
		messages.put(key, message);
		receiveNewMessage(message);
		return key;
	}

	public void onCompleted(String key) {
		messages.remove(key);
		if (messages.size() == 0) {
			messageIsEmpty();
		}
	}

	public abstract void receiveNewMessage(AbstractMessage message);
	
	public abstract void messageIsEmpty();

}
