## Format
### Python
```python
from brightics.function.statistics import string_summary
res = string_summary(table = ,input_cols = ,group_by = )
res['summary_table']
res['count_table']
```

## Description
This function reports group-wise summary statistics for selected string columns. The results are two tables; Statistic table / Count table

Supported statistics for Statistic table

- max : Maximum value of a selected string column.
- min : Minimum value of a selected string column. 
- mode : Modes of a selected string column. The result is array of all mode values.
- number of rows : The number of rows.
- number of nulls : The number of null values in a selected column.
- number of distincts : The number of distinct values in a selected column.
- number of white space : The number of empty strings in a selected column.
- number of space padded : The number of strings in which white space characters have been stripped from the beginning and the end of the string.

Supported statistics for Count table

- count : The number of each value in a selected column.
- rate : The rate of each value in a selected column.
- cumulative percentage : The cumulative percentage in a selected column.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Group By**: Columns to group by

#### Outputs: table, table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **group_by**: Columns to group by

#### Outputs: table, table

