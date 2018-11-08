package com.samsung.sds.brightics.server.model.param;

import java.util.Map;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class JobParam {

	private String user;

	private String jid;

	@NotEmpty
	private String main;

	private String duration;

	@Deprecated
	private Map<String, Object> args;

	@NotEmpty
	private Map<String, Map<String, Object>> models;

	private String version;

	private boolean converted = false;
}
