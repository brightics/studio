## Format
### Python
```python
from brightics.function.transform import split_data
res = split_data(train_ratio = ,test_ratio = ,random_state = )
res['train_table']
res['test_table']
```

## Description
Split data into random train and test subsets.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Train Ratio**: Train ratio.
   - Value type : Double
2. **Test Ratio**: Test ratio.
   - Value type : Double
3. **Seed**: The seed used by the random number generator.
   - Value type : Integer

#### Outputs
1. **train_table**: table
2. **test_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **train_ratio**: Train ratio.
   - Value type : Double
2. **test_ratio**: Test ratio.
   - Value type : Double
3. **random_state**: The seed used by the random number generator.
   - Value type : Integer

#### Outputs
1. **train_table**: table
2. **test_table**: table

