## Format
### Python
```python
from brightics.function.extraction import bucketizer
res = bucketizer(input_cols = ,radio_splits = ,splits = ,splits_from = ,splits_to = ,splits_by = ,new_name = )
res['out_table']
```

## Description
Grouping continuous data to buckets using splits.

If two input tables are chosen, the first table would be used for in-table and the second table would be used for split.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column name to deal with. From input table, one column can be selected (It should be number type column). If two tables are chosen, another column name should be selected for split. (It should be number type column.)
   - Allowed column type : Integer, Long, Float, Double
2. **Splits Type**: Series of points for mapping continuous data into buckets. It is mandatory when the number of input table is one. It can be alternated via the second input table. It can't contain NaN, null.
Splits : ( 10, 20, 30 ) -> buckets : [10,20), [20,30)
The format of Splits
List format(String) : 10, 20, 30, 40, 50
Range format : 10 to 50 by 10
In the list format, -Infinity and Infinity are available for the input value. ex) (-Infinity, 10, Infinity)

   - Available items
      - List Format (default)
      - Range Format
3. **Splits**: 
4. **From**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
5. **To**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
6. **By**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
7. **New Column Name**: New column name. (Default : input column name + "_bucketed" ) Note that only English and Korean alphabets, decimal digits that is not first, and an underscore(_) are available for a column name.
   - Value type : String
   - Default : Enter value

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column name to deal with. From input table, one column can be selected (It should be number type column). If two tables are chosen, another column name should be selected for split. (It should be number type column.)
   - Allowed column type : Integer, Long, Float, Double
2. **radio_splits**: Series of points for mapping continuous data into buckets. It is mandatory when the number of input table is one. It can be alternated via the second input table. It can't contain NaN, null.
Splits : ( 10, 20, 30 ) -> buckets : [10,20), [20,30)
The format of Splits
List format(String) : 10, 20, 30, 40, 50
Range format : 10 to 50 by 10
In the list format, -Infinity and Infinity are available for the input value. ex) (-Infinity, 10, Infinity)

   - Available items
      - array (default)
      - from_to_by
3. **splits**: 
4. **splits_from**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
5. **splits_to**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
6. **splits_by**<b style="color:red">*</b>: 
   - Value type : Double
   - Default : Enter value
7. **new_name**: New column name. (Default : input column name + "_bucketed" ) Note that only English and Korean alphabets, decimal digits that is not first, and an underscore(_) are available for a column name.
   - Value type : String
   - Default : Enter value

#### Outputs
1. **out_table**: table

