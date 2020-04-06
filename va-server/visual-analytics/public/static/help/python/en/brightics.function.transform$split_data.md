## Format
### Python
```python
from brightics.function.transform import split_data
res = split_data(table = ,train_ratio = ,test_ratio = ,random_state = ,group_by = )
res['train_table']
res['test_table']
```

## Description
Split data into random train and test subsets.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Train Ratio**: Train ratio.
   - Value type : Double
   - Default : 7.0
2. **Test Ratio**: Test ratio.
   - Value type : Double
   - Default : 3.0
3. **Seed**: The seed used by the random number generator.
   - Value type : Integer
4. **Group By**: Columns to group by

#### Outputs: table, table

### Python
#### Inputs: table

#### Parameters
1. **train_ratio**: Train ratio.
   - Value type : Double
   - Default : 7.0
2. **test_ratio**: Test ratio.
   - Value type : Double
   - Default : 3.0
3. **random_state**: The seed used by the random number generator.
   - Value type : Integer
4. **group_by**: Columns to group by

#### Outputs: table, table

