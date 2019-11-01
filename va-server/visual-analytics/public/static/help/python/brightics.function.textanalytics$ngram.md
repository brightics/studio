## Format
### Python
```python
from brightics.function.textanalytics import ngram
res = ngram(table = ,input_col = ,n = )
res['out_table']
```

## Description
"An n-gram is a contiguous sequence of n items from a given sample of text or speech."

Reference: 
+ <https://en.wikipedia.org/wiki/N-gram>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **N**: N-gram size.
   - Value type : Integer
   - Default : 2 (value >= 1)

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **n**: N-gram size.
   - Value type : Integer
   - Default : 2 (value >= 1)

#### Outputs: table

