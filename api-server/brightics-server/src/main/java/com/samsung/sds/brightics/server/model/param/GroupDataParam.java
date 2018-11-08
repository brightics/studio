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
public class GroupDataParam {
    
    @NotEmpty
    private String table;
	
    private String group;
    
    private String[] columns;
    
	private int limit = 1000;
	
}
