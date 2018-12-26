## Format
### Python
```python
from brightics.function.statistics import ftest_for_stacked_data
res = ftest_for_stacked_data(response_cols = ,factor_col = ,alternatives = ,confi_level = ,first = ,second = )
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
#### Inputs
1. **table**: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: 
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **Alternatives**: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
4. **Confidence Level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **First**<b style="color:red">*</b>: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **Second**<b style="color:red">*</b>: The second label in the label column
   - Value type : String
   - Default : Enter value

#### Outputs
1. **model**: model
2. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: 
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **alternatives**: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
4. **confi_level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **first**<b style="color:red">*</b>: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **second**<b style="color:red">*</b>: The second label in the label column
   - Value type : String
   - Default : Enter value

#### Outputs
1. **model**: model
2. **out_table**: table

