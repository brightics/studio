## Format
### Python
```python
from brightics.function.statistics import cross_table
res = cross_table(table = ,input_cols_1 = ,input_cols_2 = ,result = ,margins = ,group_by = )
res['model']
```

## Description
"In statistics, a contingency table (also known as a cross tabulation or crosstab) is a type of table in a matrix format that displays the (multivariate) frequency distribution of the variables. They are heavily used in survey research, business intelligence, engineering and scientific research. They provide a basic picture of the interrelation between two variables and can help find interactions between them." 

 This function provides cross table of the given columns. 

Reference:
+ <https://en.wikipedia.org/wiki/Contingency_table>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns 1**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **Input Columns 2**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
3. **Result**: Contents to be presented in the cross table.
   - Available items
      - N (default)
      - N / Row Total
      - N / Column Total
      - N / Total
4. **Margins**: Add row/column margins (subtotals).
5. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols_1**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **input_cols_2**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
3. **result**: Contents to be presented in the cross table.
   - Available items
      - N (default)
      - N / Row Total
      - N / Column Total
      - N / Total
4. **margins**: Add row/column margins (subtotals).
5. **group_by**: Columns to group by

#### Outputs: model

