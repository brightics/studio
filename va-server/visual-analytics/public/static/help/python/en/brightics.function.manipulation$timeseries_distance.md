## Format
### Python
```python
from brightics.function.manipulation import timeseries_distance
res = timeseries_distance(table = ,input_col_1 = ,input_col_2 = ,distance_type = ,hold_cols = ,alphabet = )
res['out_table']
```

## Description
This function calculates distance between 2 double arrays.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Timeseries 1**<b style="color:red">*</b>: Column name of the first Timeseries Array (Double) or String type. 'Sax' must be chosen for 'Distance Type' to use String type column.
   - Allowed column type : Double[], String
2. **Input Timeseries 2**<b style="color:red">*</b>: Column name of the second Timeseries Array (Double) or String type. 'Sax' must be chosen for 'Distance Type' to use String type column.
   - Allowed column type : Double, String
3. **Distance type**<b style="color:red">*</b>: Distance method between 2 double arrays. It must be one of 'Sax', 'Dtw', 'Euclidean', 'Correlation', 'L1Distance', 'EuclideanWithInterpolation', 'L1DistanceWithInterpolation'.
4. **Hold Columns**: Columns to be used for index after calculation. If distance matrix is calculated, 'row_' and 'column_' are prefixed in front of column names in 'Hold Columns' for the output table. If omitted, row index is used internally and column names for index will be 'row_index_distance' and 'column_index_distance'.
   - Allowed column type : Double, String
5. **Alphabet**: Alphabet size for 'Sax' strings. If distance type is 'Sax', you must fix one of 'Alphabet Column' or 'Alphabet'. It is 'Sax' related option. (between 2 and 26)
   - Value type : Integer
   - Default : 26

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col_1**<b style="color:red">*</b>: Column name of the first Timeseries Array (Double) or String type. 'Sax' must be chosen for 'Distance Type' to use String type column.
   - Allowed column type : Double[], String
2. **input_col_2**<b style="color:red">*</b>: Column name of the second Timeseries Array (Double) or String type. 'Sax' must be chosen for 'Distance Type' to use String type column.
   - Allowed column type : Double, String
3. **distance_type**<b style="color:red">*</b>: Distance method between 2 double arrays. It must be one of 'Sax', 'Dtw', 'Euclidean', 'Correlation', 'L1Distance', 'EuclideanWithInterpolation', 'L1DistanceWithInterpolation'.
4. **hold_cols**: Columns to be used for index after calculation. If distance matrix is calculated, 'row_' and 'column_' are prefixed in front of column names in 'Hold Columns' for the output table. If omitted, row index is used internally and column names for index will be 'row_index_distance' and 'column_index_distance'.
   - Allowed column type : Double, String
5. **alphabet**: Alphabet size for 'Sax' strings. If distance type is 'Sax', you must fix one of 'Alphabet Column' or 'Alphabet'. It is 'Sax' related option. (between 2 and 26)
   - Value type : Integer
   - Default : 26

#### Outputs: table

