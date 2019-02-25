package com.samsung.sds.brightics.common.data.client.impl;

import java.util.concurrent.ConcurrentHashMap;

import com.samsung.sds.brightics.common.data.client.KVStoreClient;

public class InMemoryClient extends KVStoreClient {

	private ConcurrentHashMap<String, Object> inMemoryRepository;

	public InMemoryClient() {
		inMemoryRepository = new ConcurrentHashMap<>();
	}

	@Override
	protected void putImpl(String key, Object data) {
		try {
			inMemoryRepository.put(key, data);
		} catch (Exception e) {
			LOGGER.error("failed to put data to in memory", e);
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	protected <T> T getImpl(String key, Class<T> clazz) {
		try {
			return (T) inMemoryRepository.get(key);
		} catch (Exception e) {
			LOGGER.error("failed to get data to in memory", e);
			return null;
		}
	}

	@Override
	protected long deleteImpl(String key) {
		try {
			inMemoryRepository.remove(key);
		} catch (Exception e) {
			LOGGER.error("failed to get data to in memory", e);
		}
		return 0;
	}

}
