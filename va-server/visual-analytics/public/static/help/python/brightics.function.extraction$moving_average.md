## Format
### Python
```python
from brightics.function.extraction import moving_average
res = moving_average(input_cols = ,weights = ,window_size = ,weights_array = ,mode = )
res['out_table']
```

## Description
This function computes moving average values for analyzing particular time series data.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: target column names(numeric type)
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Weights**: Set a linear weight coefficients equally or not.
   - Available items
      - Uniform Weights (default)
      - Custom Weights
3. **Window Size**: window size [1, Nrow] between 1 and Nrow
   - Value type : Integer
   - Default : 1
4. **Weights Array (from last)**: Linear weight coefficients in reverse time-order.
5. **Mode**: This determines a computing method.
   - Available items
      - Centered Moving Average
      - Past Values Only (default)

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: target column names(numeric type)
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **weights**: Set a linear weight coefficients equally or not.
   - Available items
      - uniform_weights (default)
      - custom_weights
3. **window_size**: window size [1, Nrow] between 1 and Nrow
   - Value type : Integer
   - Default : 1
4. **weights_array**: Linear weight coefficients in reverse time-order.
5. **mode**: This determines a computing method.
   - Available items
      - centered_moving_average
      - past_values_only (default)

#### Outputs
1. **out_table**: table

