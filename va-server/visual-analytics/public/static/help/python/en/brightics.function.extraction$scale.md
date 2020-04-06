## Format
### Python
```python
from brightics.function.extraction import scale
res = scale(table = ,input_cols = ,scaler = ,suffix = ,group_by = )
res['out_table']
res['model']
```

## Description
Scale selected features. MinMaxScaler, StandardScaler(z-score), MaxAbsScaler, and RobustScaler are supported.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Normalization Type**: Choose one of MinMaxScaler, StandardScaler, MaxAbsScaler, and RobustScaler.
   - Available items
      - MinMaxScaler (default)
      - StandardScaler
      - MaxAbsScaler
      - RobustScaler
3. **Suffix**: Suffix for the new column names.
   - Value type : String
   - Default : _min_max
4. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **scaler**: Choose one of MinMaxScaler, StandardScaler, MaxAbsScaler, and RobustScaler.
   - Available items
      - MinMaxScaler (default)
      - StandardScaler
      - MaxAbsScaler
      - RobustScaler
3. **suffix**: Suffix for the new column names.
   - Value type : String
   - Default : _min_max
4. **group_by**: Columns to group by

#### Outputs: table, model

