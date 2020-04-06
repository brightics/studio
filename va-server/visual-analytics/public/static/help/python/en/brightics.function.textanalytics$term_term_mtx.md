## Format
### Python
```python
from brightics.function.textanalytics import term_term_mtx
res = term_term_mtx(table = ,model = ,input_col = ,result_type = )
res['out_table']
```

## Description
A term-term matrix is a square matrix, where each cell represents how many documents that contain the two term.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Result**: Select result type.
   - Available items
      - Sparse (default)
      - Dense

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **result_type**: Select result type.
   - Available items
      - sparse (default)
      - dense

#### Outputs: table

