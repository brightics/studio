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
@EqualsAndHashCode(callSuper=false)
public class ExecuteModelParam{
	
	private String deployId;

	@NotEmpty
	private String registerUserId;
	
	@NotEmpty
	private String version;
	
	@NotEmpty
	private String userId;
	
	private Map<String, Object> globalVariable;
	
}