## Format
### Python
```python
from brightics.function.statistics import ftest_for_stacked_data
res = ftest_for_stacked_data(table = ,response_cols = ,factor_col = ,alternatives = ,confi_level = ,first = ,second = ,group_by = )
res['model']
res['out_table']
```

## Description
In statistics, an F-test for the null hypothesis that two normal populations have the same variance is sometimes used, although it needs to be used with caution as it can be sensitive to the assumption that the variables have this distribution.

This function conduct the F-test for stacked dataset.

Reference:

https://en.wikipedia.org/wiki/F-test_of_equality_of_variances

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **Alternatives**<b style="color:red">*</b>: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
   - Available items
      - Greater
      - Less
      - Two Sided (default)
4. **Confidence Level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **First**: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **Second**: The second label in the label column
   - Value type : String
   - Default : Enter value
7. **Group By**: Columns to group by

#### Outputs: model, table

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **alternatives**<b style="color:red">*</b>: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
   - Available items
      - larger
      - smaller
      - two-sided (default)
4. **confi_level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **first**: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **second**: The second label in the label column
   - Value type : String
   - Default : Enter value
7. **group_by**: Columns to group by

#### Outputs: model, table

