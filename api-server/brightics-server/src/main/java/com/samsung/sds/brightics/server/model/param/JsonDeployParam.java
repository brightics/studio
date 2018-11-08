package com.samsung.sds.brightics.server.model.param;
import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper=false)
public class JsonDeployParam{
	
	private String deleteYn;
	
	@NotEmpty
	private String[] parameters;
	
}