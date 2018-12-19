## Format
### Python
```python
from brightics.function.transform import random_sampling
res = random_sampling(num_or_frac = ,num = ,frac = ,replace = ,seed = ,group_by = )
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
1. **Method**: Choose which parameter to use.
   - Available items
      - Number (default)
      - Fraction
2. **Number**: Number of items to return.
   - Value type : Integer
   - Default : 1
3. **Fraction**: Fraction of items to return.
   - Value type : Double
   - Default : 0.5
4. **Replacement**: Sample with or without replacement.
5. **Seed**: Seed for the random number generator.
   - Value type : Integer
6. **Group By**: Columns to group by

#### Outputs
1. **table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **num_or_frac**: Choose which parameter to use.
   - Available items
      - num (default)
      - frac
2. **num**: Number of items to return.
   - Value type : Integer
   - Default : 1
3. **frac**: Fraction of items to return.
   - Value type : Double
   - Default : 0.5
4. **replace**: Sample with or without replacement.
5. **seed**: Seed for the random number generator.
   - Value type : Integer
6. **group_by**: Columns to group by

#### Outputs
1. **table**: table

