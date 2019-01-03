## Format
### Python
```python
from brightics.function.statistics.string_summary import string_summary
res = string_summary(input_cols = )
res['table1']
res['table2']
```

## Description
This function reports group-wise summary statistics for selected string columns. The results are two tables; Statistic table / Count table

Supported statistics
min : Minimum value of a selected string column. 
max : Maximum value of a selected string column.
mode : Modes of a selected string column. The result is array of all mode values.
number of distincts : The number of distinct values in a selected column.
number of rows : The number of rows.
number of nulls : The number of null values in a selected column.
Count table
count : The number of each value in a selected column.
rate : The rate of each value in a selected column.
cumulative percentage : The cumulative percentage in a selected column.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Column names to be summarized. If no columns are selected, all columns in the input table are summarized.
   - Allowed column type : Integer, Double, Long, Decimal, Float, String

#### Outputs
1. **table1**: table
2. **table2**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column names to be summarized. If no columns are selected, all columns in the input table are summarized.
   - Allowed column type : Integer, Double, Long, Decimal, Float, String

#### Outputs
1. **table1**: table
2. **table2**: table

