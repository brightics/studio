package com.samsung.sds.brightics.common.data.parquet.reader.info;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ColumnFilterParameter {
	
	private long start = -1;
	private long end = -1;
	private int[] selectedColumns = new int[0];
	
}
