## Format
### Python
```python
from brightics.function.extraction import moving_average
res = moving_average(table = ,input_cols = ,weights = ,window_size = ,weights_array = ,mode = ,group_by = )
res['out_table']
```

## Description
This function computes moving average values for analyzing particular time series data.

Reference:
+ <https://en.wikipedia.org/wiki/Moving_average>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Weights**: Set a linear weight coefficients equally or not.
   - Available items
      - Uniform Weights (default)
      - Custom Weights
3. **Window Size**: window size [1, Nrow] between 1 and Nrow
   - Value type : Integer
   - Default : 1 (value >= 1)
4. **Weights Array (from last)**: Linear weight coefficients in reverse time-order.
5. **Mode**: This determines a computing method.
   - Available items
      - Centered Moving Average
      - Past Values Only (default)
6. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **weights**: Set a linear weight coefficients equally or not.
   - Available items
      - uniform_weights (default)
      - custom_weights
3. **window_size**: window size [1, Nrow] between 1 and Nrow
   - Value type : Integer
   - Default : 1 (value >= 1)
4. **weights_array**: Linear weight coefficients in reverse time-order.
5. **mode**: This determines a computing method.
   - Available items
      - centered_moving_average
      - past_values_only (default)
6. **group_by**: Columns to group by

#### Outputs: table

