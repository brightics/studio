package com.samsung.sds.brightics.agent.context.python.calcitepython;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.TableFactory;

public class S2pTableFactory implements TableFactory<S2pTable> {
	public S2pTableFactory() {
	}
	
	@SuppressWarnings("unchecked")
	public S2pTable create(SchemaPlus schema, String name, 
			Map<String, Object> operand, RelDataType rowType) {
		
		Map<String, String> oldCols = (Map<String, String>) operand.get("columns");
		// To remove spaces in column name
		Map<String, String> newCols = new LinkedHashMap<String, String>();
		for(String col : oldCols.keySet()) {
			newCols.put(col.trim(), oldCols.get(col).trim());
		}
		
		return new S2pTable(newCols);
	}
}
