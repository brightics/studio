## Format
### Python
```python
from brightics.function.extraction import scale
res = scale(input_cols = ,scaler = ,suffix = ,group_by = )
res['out_table']
res['model']
```

## Description
Scale selected features. MinMaxScaler, StandardScaler, MaxAbsScaler, and RobustScaler are supported.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Select features to scale.
   - Allowed column type : Integer, Long, Float, Double
2. **Normalization Type**<b style="color:red">*</b>: Choose one of MinMaxScaler, StandardScaler, MaxAbsScaler, and RobustScaler.
   - Available items
      - MinMaxScaler (default)
      - StandardScaler
      - MaxAbsScaler
      - RobustScaler
3. **Suffix**: Suffix for the new column names.
   - Value type : String
   - Default : _min_max
4. **Group By**: Colums to group by

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Select features to scale.
   - Allowed column type : Integer, Long, Float, Double
2. **scaler**<b style="color:red">*</b>: Choose one of MinMaxScaler, StandardScaler, MaxAbsScaler, and RobustScaler.
   - Available items
      - MinMaxScaler (default)
      - StandardScaler
      - MaxAbsScaler
      - RobustScaler
3. **suffix**: Suffix for the new column names.
   - Value type : String
   - Default : _min_max
4. **group_by**: Colums to group by

#### Outputs
1. **out_table**: table
2. **model**: model

