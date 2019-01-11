## Format
### Python
```python
from brightics.function.transform import random_sampling
res = random_sampling(axis = ,num_or_frac = ,num = ,frac = ,replace = ,seed = ,group_by = )
res['table']
```

## Description
Return a random sample of items from an axis of object.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Row or Column**: Choose which axis to sample.
   - Available items
      - Row (default)
      - Column
2. **Method**: Choose which parameter to use.
   - Available items
      - Number (default)
      - Fraction
3. **Number**: Number of items to return.
   - Value type : Integer
4. **Fraction**: Fraction of items to return.
   - Value type : Double
5. **Replacement**: Sample with or without replacement.
6. **Seed**: Seed for the random number generator.
   - Value type : Integer
7. **Group By**: Columns to group by

#### Outputs
1. **table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **axis**: Choose which axis to sample.
   - Available items
      - 0 (default)
      - 1
2. **num_or_frac**: Choose which parameter to use.
   - Available items
      - num (default)
      - frac
3. **num**: Number of items to return.
   - Value type : Integer
4. **frac**: Fraction of items to return.
   - Value type : Double
5. **replace**: Sample with or without replacement.
6. **seed**: Seed for the random number generator.
   - Value type : Integer
7. **group_by**: Columns to group by

#### Outputs
1. **table**: table

