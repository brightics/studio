## Format
### Python
```python
from brightics.function.extraction import binarizer
res = binarizer(table = ,column = ,threshold_type = ,threshold = ,out_col_name = )
res['out_table']
```

## Description
Binarize a column of continuous features given a threshold. The features satisfying the condition, will be binarized to 1.0. The features not satisfying the condition, will be binarized to 0.0.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
2. **Threshold Type**: Threshold type.
   - Available items
      - 1 if value>threshold (default)
      - 1 if value>=threshold
3. **Threshold**: Threshold used to binarize continuous features. Default: 0
   - Value type : Double
   - Default : 0
4. **Out Column Name**: Out column name for the binarized result. Default : 'binarized_' + column name
   - Value type : String
   - Default : Enter value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
2. **threshold_type**: Threshold type.
   - Available items
      - greater (default)
      - greater_equal
3. **threshold**: Threshold used to binarize continuous features. Default: 0
   - Value type : Double
   - Default : 0
4. **out_col_name**: Out column name for the binarized result. Default : 'binarized_' + column name
   - Value type : String
   - Default : Enter value

#### Outputs: table

