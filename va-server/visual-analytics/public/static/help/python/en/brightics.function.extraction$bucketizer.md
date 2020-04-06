## Format
### Python
```python
from brightics.function.extraction import bucketizer
res = bucketizer(table = ,input_cols = ,bucket_type = ,radio_splits = ,splits = ,splits_from = ,splits_to = ,splits_by = ,new_name = )
res['out_table']
```

## Description
Grouping continuous data to buckets using splits.

If two input tables are chosen, the first table would be used for in-table and the second table would be used for split.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Bucket Type**: 
   - Available items
      - Left Closed, Right Open (default)
      - Right Closed, Left Open
3. **Splits Type**: Series of points for mapping continuous data into buckets. It is mandatory when the number of input table is one. It can be alternated via the second input table. It can't contain NaN, null.
Splits : ( 10, 20, 30 ) -> buckets : [10,20), [20,30)
The format of Splits
List format(String) : 10, 20, 30, 40, 50
Range format : 10 to 50 by 10
In the list format, -Infinity and Infinity are available for the input value. ex) (-Infinity, 10, Infinity)

   - Available items
      - List Format (default)
      - Range Format
4. **Splits**: Input list of split points
5. **From**: 
   - Value type : Double
   - Default : Enter value
6. **To**: 
   - Value type : Double
   - Default : Enter value
7. **By**: 
   - Value type : Double
   - Default : 1
8. **New Column Name**: New column name. (Default : input column name + "_bucketed" ) Note that only English and Korean alphabets, decimal digits that is not first, and an underscore(_) are available for a column name.
   - Value type : String
   - Default : Enter value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **bucket_type**: 
   - Available items
      - left_closed (default)
      - right_closed
3. **radio_splits**: Series of points for mapping continuous data into buckets. It is mandatory when the number of input table is one. It can be alternated via the second input table. It can't contain NaN, null.
Splits : ( 10, 20, 30 ) -> buckets : [10,20), [20,30)
The format of Splits
List format(String) : 10, 20, 30, 40, 50
Range format : 10 to 50 by 10
In the list format, -Infinity and Infinity are available for the input value. ex) (-Infinity, 10, Infinity)

   - Available items
      - array (default)
      - from_to_by
4. **splits**: Input list of split points
5. **splits_from**: 
   - Value type : Double
   - Default : Enter value
6. **splits_to**: 
   - Value type : Double
   - Default : Enter value
7. **splits_by**: 
   - Value type : Double
   - Default : 1
8. **new_name**: New column name. (Default : input column name + "_bucketed" ) Note that only English and Korean alphabets, decimal digits that is not first, and an underscore(_) are available for a column name.
   - Value type : String
   - Default : Enter value

#### Outputs: table

