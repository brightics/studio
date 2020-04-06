## Format
### Python
```python
from brightics.function.extraction import discretize_quantile
res = discretize_quantile(table = ,input_col = ,num_of_buckets = ,out_col_name = ,group_by = )
res['out_table']
res['model']
```

## Description
"Quantile-based discretization function. Discretize variable into equal-sized buckets based on sample quantiles. "

Reference:
+ <https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Number of Buckets**: Number of buckets. 10 for deciles, 4 for quartiles, etc. Alternately array of quantiles, e.g. [0, .25, .5, .75, 1.] for quartiles.
   - Value type : Integer
   - Default : 2 (value >= 1)
3. **Out Column Name**: Out column name.
   - Value type : String
   - Default : bucket_number
4. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **num_of_buckets**: Number of buckets. 10 for deciles, 4 for quartiles, etc. Alternately array of quantiles, e.g. [0, .25, .5, .75, 1.] for quartiles.
   - Value type : Integer
   - Default : 2 (value >= 1)
3. **out_col_name**: Out column name.
   - Value type : String
   - Default : bucket_number
4. **group_by**: Columns to group by

#### Outputs: table, model

