## Format
### Python
```python
from brightics.function.extraction import one_hot_encoder
res = one_hot_encoder(table = ,input_cols = ,prefix = ,prefix_list = ,suffix = ,drop_last = ,group_by = )
res['out_table']
res['model']
```

## Description
Encode categorical integer features using a one-hot aka one-of-K scheme.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, String
2. **Prefix Type**: Choose prefix type.
   - Available items
      - Use existing column name(s) (default)
      - Enter new column name(s)
3. **Prefix(es)**: List of prefix name(s). The length of this list should be equal to the length of input columns.
4. **Suffix Type**: Choose suffix type.
   - Available items
      - Index (default)
      - Label
5. **Drop Last**: Drop the last column.
6. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, String
2. **prefix**: Choose prefix type.
   - Available items
      - col_name (default)
      - list
3. **prefix_list**: List of prefix name(s). The length of this list should be equal to the length of input columns.
4. **suffix**: Choose suffix type.
   - Available items
      - index (default)
      - label
5. **drop_last**: Drop the last column.
6. **group_by**: Columns to group by

#### Outputs: table, model

