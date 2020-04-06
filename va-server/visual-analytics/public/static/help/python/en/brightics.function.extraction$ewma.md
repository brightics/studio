## Format
### Python
```python
from brightics.function.extraction import ewma
res = ewma(table = ,input_cols = ,period_number = ,ratio_type = ,custom_ratio = ,group_by = )
res['out_table']
```

## Description
Compute exponentially weighted moving average(EWMA) values for selected columns.

Reference:
+ <https://en.wikipedia.org/wiki/EWMA_chart>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Period Number**: Number of periods to average over. (window size) Entered 'number' should be integer which is between one and the total data size, including both. 1 <= 'number' <= data_size
   - Value type : Integer
   - Default : 1 (value >= 1)
3. **Ratio Type**: A smoothing/decay ratio type. If 'Wilder's Ratio' is chosen, the ratio is 1/n. n is the period number. 
   - Available items
      - Custom (default)
      - Wilder's Ratio
4. **Custom Ratio**: A smoothing/decay ratio. If it is empty, it will be calculated as 0.5.
   - Value type : Double
   - Default : 0.5 (0.0 <= value <= 1.0)
5. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **period_number**: Number of periods to average over. (window size) Entered 'number' should be integer which is between one and the total data size, including both. 1 <= 'number' <= data_size
   - Value type : Integer
   - Default : 1 (value >= 1)
3. **ratio_type**: A smoothing/decay ratio type. If 'Wilder's Ratio' is chosen, the ratio is 1/n. n is the period number. 
   - Available items
      - custom (default)
      - wilder_ratio
4. **custom_ratio**: A smoothing/decay ratio. If it is empty, it will be calculated as 0.5.
   - Value type : Double
   - Default : 0.5 (0.0 <= value <= 1.0)
5. **group_by**: Columns to group by

#### Outputs: table

