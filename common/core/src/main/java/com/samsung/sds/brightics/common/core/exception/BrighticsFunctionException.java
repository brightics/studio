package com.samsung.sds.brightics.common.core.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * For v3.6 function exception handling
 * A function exception has multiple errors.
 * also, parameters and label information must be managed at the same time. 
 * 
 * @author hk.Im
 */
public class BrighticsFunctionException extends AbsBrighticsException {

	private static final long serialVersionUID = 1L;

	public List<brighticsErrorVO> brtcErrors = new ArrayList<>();
	public String functionName;
	public boolean isParsing = false;
	
	public class brighticsErrorVO {
		public String code;
		public String[] params;
		public brighticsErrorVO(String code, String[] params){
			this.code = code;
			this.params = params;
		}
	}

	/**
	 * @param code  : set just error code number. ex) 0001
	 */
	public BrighticsFunctionException(String code) {
		this.brtcErrors.add(new brighticsErrorVO("FN"+ HYPHEN + code, ArrayUtils.EMPTY_STRING_ARRAY));
	}

	/**
	 * @param code  : set just error code number. ex) 0001
	 * @param params : exception message parameters. ex) {column, in-data}
	 */
	public BrighticsFunctionException(String code, String[] params) {
		this.brtcErrors.add(new brighticsErrorVO("FN"+ HYPHEN + code, params));
	}
	
	/**
	 * @param errors : code, parameter error set list.
	 */
	public BrighticsFunctionException(List<Map<String, String[]>> errors) {
		for (Map<String, String[]> error : errors) {
			for (String code : error.keySet()) {
				this.brtcErrors.add(new brighticsErrorVO("FN"+ HYPHEN + code, error.get(code)));
			}
		}
	}

	@Override
	public String getMessage() {
		return StringUtils.join(brtcErrors.stream()
				.map(error -> convertMessage(error.code, error.params)).toArray(), ", ");
	}

	/**
	 * For brightics function parameter parsing to label.
	 * If isPasing is true and functionName is not null, change the error parameter to label.
	 * @param functionName : label changed function name.
	 * @return
	 */
	public BrighticsFunctionException setTagFunction(String functionName) {
		this.functionName = functionName;
		for (brighticsErrorVO brighticsErrorVO : brtcErrors) {
			if(brighticsErrorVO.params.length > 0){
				isParsing = true;
				break;
			}
		}
		return this;
	}

}


