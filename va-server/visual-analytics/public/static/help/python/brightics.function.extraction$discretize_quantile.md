## Format
### Python
```python
from brightics.function.extraction import discretize_quantile
res = discretize_quantile(input_col = ,num_of_buckets = ,bucket_opt = ,out_col_name = )
res['out_table']
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
3. **Bucket Type**: Indicating whether the intervals include the right or the left bin edge.
   - Available items
      - Left-closed and Right-open (default)
      - Left-open and Right-closed
4. **Out Column Name**: 
   - Value type : String

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **num_of_buckets**: Number of buckets.
   - Value type : Integer
3. **bucket_opt**: Indicating whether the intervals include the right or the left bin edge.
   - Available items
      - False (default)
      - True
4. **out_col_name**: 
   - Value type : String

#### Outputs
1. **out_table**: table

