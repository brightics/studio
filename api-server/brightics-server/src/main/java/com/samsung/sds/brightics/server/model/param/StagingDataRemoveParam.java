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
public class StagingDataRemoveParam {

	@NotEmpty
	private String user;

	private Map<String, String[]> mids;
}
