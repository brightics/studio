## Format
### Python
```python
from brightics.function.timeseries import holt_winters_train
res = holt_winters_train(table = ,input_cols = ,model_type = ,period = ,group_by = )
res['model']
```

## Description
Given a seasonal time series and the period length, this function fits the Holt-Winters model(additive or multiplicative).

Reference:
+ <https://otexts.com/fpp2/holt-winters.html>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Model Type**: Use 'additive' if the variance is constant and 'multiplicative' if the variance is proportional to the local mean.
   - Available items
      - Additive (default)
      - Multiplicative
3. **Period**<b style="color:red">*</b>: The period length of seasonality.
   - Value type : Integer
   - Default : (value >= 2)
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **model_type**: Use 'additive' if the variance is constant and 'multiplicative' if the variance is proportional to the local mean.
   - Available items
      - additive (default)
      - multiplicative
3. **period**<b style="color:red">*</b>: The period length of seasonality.
   - Value type : Integer
   - Default : (value >= 2)
4. **group_by**: Columns to group by

#### Outputs: model

