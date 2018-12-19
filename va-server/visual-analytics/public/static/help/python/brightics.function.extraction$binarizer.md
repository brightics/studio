## Format
### Python
```python
from brightics.function.extraction import binarizer
res = binarizer(column = ,threshold = ,out_col_name = )
res['table']
```

## Description
Binarize a column of continuous features given a threshold. The features greater than the threshold, will be binarized to 1.0. The features equal to or less than the threshold, will be binarized to 0.0.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Column**<b style="color:red">*</b>: Column name to binarize. Only one column is allowed. Column should be of number type.
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **Threshold**: Threshold used to binarize continuous features. Default: 0
   - Value type : Double
   - Default : 0
3. **Out Column Name**: Out column name for the binarized result. Default : 'binarized_' + column name
   - Value type : String
   - Default : Enter value

#### Outputs
1. **table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **column**<b style="color:red">*</b>: Column name to binarize. Only one column is allowed. Column should be of number type.
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **threshold**: Threshold used to binarize continuous features. Default: 0
   - Value type : Double
   - Default : 0
3. **out_col_name**: Out column name for the binarized result. Default : 'binarized_' + column name
   - Value type : String
   - Default : Enter value

#### Outputs
1. **table**: table

