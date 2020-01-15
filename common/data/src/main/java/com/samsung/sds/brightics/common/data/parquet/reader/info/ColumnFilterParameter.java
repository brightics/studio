package com.samsung.sds.brightics.common.data.parquet.reader.info;

import java.util.Arrays;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import lombok.Data;

@Data
public class ColumnFilterParameter {

	private int start = -1;
	private int end = -1;
	private int[] selectedColumns = new int[0];
	
	private int[] filteredColumns;

	public ColumnFilterParameter() {
		filteredColumns = new int[0];
	}

	public ColumnFilterParameter(int start, int end, int[] selectedColumns) {
		filteredColumns = generateSelectedColumns(start, end, selectedColumns);
	}

	private int[] generateSelectedColumns(int start, int end, int[] selectedColumns) {
		if(selectedColumns == null) {
			selectedColumns = new int[0];
		}
		Stream<Integer> selected = Arrays.stream(selectedColumns).boxed();
		if(start >= 0 && end >= 0 && end - start >= 0) {
			Stream<Integer> range = IntStream.range(start, end + 1).boxed();
			return Stream.concat(range, selected).distinct().sorted().mapToInt(i -> i).toArray();
		} else {
			return selected.mapToInt(i -> i).toArray();
		}
	}

}
