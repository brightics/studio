package com.samsung.sds.brightics.agent.context.python.calcitepython;

import java.util.List;

import com.google.common.collect.ImmutableList;

public enum DTypes {
	OBJECT("object"),
	INT64("int64"),
	FLOAT64("float64"),
	BOOL("bool");
	
	private static final List<DTypes> all_types = 
			ImmutableList.of(OBJECT, INT64, FLOAT64, BOOL);
	
	private static final List<DTypes> numeric_types = 
			ImmutableList.of(INT64, FLOAT64);
	
	final private String type;
	
	private DTypes(String type){
		this.type = type;
	}
	
	public String getPdType() {
		return this.type;
	}
	
	public List<DTypes> getAllTypes(){
		return DTypes.all_types;
	}
	
	public List<DTypes> getNumericTypes() {
		return DTypes.numeric_types;
	}
	
}
