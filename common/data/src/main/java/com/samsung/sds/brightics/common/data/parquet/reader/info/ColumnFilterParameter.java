package com.samsung.sds.brightics.common.data.parquet.reader.info;

import java.util.Arrays;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import lombok.Data;

@Data
public class ColumnFilterParameter {

	private int start = 0;
	private int end = 0;
	private int[] selectedColumns = new int[0];
	
	private int[] filteredColumns;

	public ColumnFilterParameter() {
	}

	public ColumnFilterParameter(int start, int end, int[] selectedColumns) {
		filteredColumns = generateSelectedColumns(start, end, selectedColumns);
	}

	private int[] generateSelectedColumns(int start, int end, int[] selectedColumns) {
		if (start < 0 || end <= 0) {
			return new int[0];
		}
		Stream<Integer> range = IntStream.range(start, end + 1).boxed();
		Stream<Integer> selected = Arrays.stream(selectedColumns).boxed();
		return Stream.concat(range, selected).distinct().sorted().mapToInt(i -> i).toArray();
	}

}
