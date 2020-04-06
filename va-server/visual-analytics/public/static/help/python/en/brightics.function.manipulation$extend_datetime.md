## Format
### Python
```python
from brightics.function.manipulation import extend_datetime
res = extend_datetime(table = ,input_col = ,impute_unit = )
res['out_table']
```

## Description
It estimates and fills in an empty or missing DateTime by checking and extending other DateTimes back-and-forth. This function checks whether the DateTime increases one unit of 'Impute Unit' parameter. Therefore, DateTime in ascending order is necessary.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **Impute Unit**<b style="color:red">*</b>: The unit of estimation. Year, Month, Day, Hour, Minute. (default: Day)

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **impute_unit**<b style="color:red">*</b>: The unit of estimation. Year, Month, Day, Hour, Minute. (default: Day)

#### Outputs: table

