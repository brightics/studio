package com.samsung.sds.brightics.server.model.entity.repository;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import java.io.Serializable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

@NoRepositoryBean
public interface BrtcRepository<T, ID extends Serializable> extends PagingAndSortingRepository<T, ID> {
	Logger LOGGER = LoggerFactory.getLogger(BrtcRepository.class);

	default <S extends T> S save(S paramS, String serviceName) {
		try {
			S saveResult = save(paramS);
			if(saveResult == null){
				throw new BrighticsCoreException("3004", serviceName);
			}
			return saveResult;
		} catch (Exception e){
			LOGGER.error("save error", e);
			throw new BrighticsCoreException("3004", serviceName);
		}
	}

	default <S extends T> S update(S paramS, String serviceName) {
		try {
			S updateResult = save(paramS);
			if(updateResult == null){
				throw new BrighticsCoreException("3005", serviceName);
			}
			return updateResult;
		} catch (Exception e){
			LOGGER.error("update error", e);
			throw new BrighticsCoreException("3005", serviceName);
		}
	}

	default void delete(ID paramID, String serviceName) {
		try {
			delete(paramID);
		} catch (Exception e) {
			LOGGER.error("delete error", e);
			throw new BrighticsCoreException("3006", serviceName);
		}
	}
}
