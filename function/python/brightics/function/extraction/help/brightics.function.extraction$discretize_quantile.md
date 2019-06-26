## Format
### Python
```python
from brightics.function.extraction import discretize_quantile
res = discretize_quantile(input_col = ,num_of_buckets = ,out_col_name = ,group_by = )
res['out_table']
res['model']
```

## Description
Quantile-based discretization function. Discretize variable into equal-sized buckets based on sample quantiles.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Number of Buckets**: Number of buckets.
   - Value type : Integer
   - Default : 2
3. **Out Column Name**: 
   - Value type : String
   - Default : bucket_number
4. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **num_of_buckets**: Number of buckets.
   - Value type : Integer
   - Default : 2
3. **out_col_name**: 
   - Value type : String
   - Default : bucket_number
4. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

