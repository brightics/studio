package com.samsung.sds.brightics.server.common.exception;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsUncodedException;
import com.samsung.sds.brightics.server.model.vo.ExceptionInfoVO;

@RestController
@ControllerAdvice
public class ExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@org.springframework.web.bind.annotation.ExceptionHandler(value = Exception.class)
	public @ResponseBody ExceptionInfoVO handleServerException(Exception exception) {
		if (exception instanceof BrighticsUncodedException) { //message from agent.
			String message = exception.getMessage();
			String detailMessage = ((AbsBrighticsException) exception).detailedCause;
			if(StringUtils.isNotEmpty(detailMessage)){
				logger.error("[SYSTEM]" + exception.getMessage() + " , detail : " + detailMessage);
			} else {
				logger.error("[SYSTEM]" + exception.getMessage());
			}
			return new ExceptionInfoVO(message, detailMessage);
		} else if (exception instanceof AbsBrighticsException) {
			logger.error("[SYSTEM]", exception);
			String message = exception.getMessage();
			String detailMessage = ((AbsBrighticsException) exception).detailedCause;
			return new ExceptionInfoVO(message, detailMessage);
		} else {
			logger.error("[SYSTEM]", exception);
			return new ExceptionInfoVO("A system error has occurred. Contact administrator.",
					ExceptionUtils.getMessage(exception));
		}
	}

}
