package com.samsung.sds.brightics.server.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrtcFunctionLabelVO {

	private String functionName;
	private String parameter;
	private String locale;
	private String label;
}
