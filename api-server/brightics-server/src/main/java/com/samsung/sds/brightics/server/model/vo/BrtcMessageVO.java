package com.samsung.sds.brightics.server.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrtcMessageVO {
	private String code;

	private String locale;
	
	private String message;
}
