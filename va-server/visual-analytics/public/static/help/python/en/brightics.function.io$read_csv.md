## Format
### Python
```python
from brightics.function.io import read_csv
res = read_csv(path = ,engine = ,delimiter = ,na_filter = ,quoting = ,encoding = ,strip_col = )
res['table']
```

## Description
This function reads a csv file into a table.

---

## Properties
### VA
#### Inputs: This function has no input data.

#### Parameters
1. **Path**<b style="color:red">*</b>: csv file path.
   - Value type : String
2. **Engine**: Parser engine to use. The C engine is faster while the python engine is currently more feature-complete.
   - Available items
      - Python (default)
      - C
3. **Delimiter**: Choose Delimiter to split
   - Value type : String
   - Default : ,
4. **Null Filtering**: 
5. **Quote**: Control field quoting behavior per csv.QUOTE_* constants. If False, quotation mark will be survived.
6. **Encoding**: Encoding to use for UTF when reading/writing.
   - Available items
      - UTF-8 (default)
      - UTF-8 with BOM
      - EUC-KR
      - Windows-949
7. **Strip White Space in Column Name**: Strip white space in column name

#### Outputs: table

### Python
#### Inputs: This function has no input data.

#### Parameters
1. **path**<b style="color:red">*</b>: csv file path.
   - Value type : String
2. **engine**: Parser engine to use. The C engine is faster while the python engine is currently more feature-complete.
   - Available items
      - python (default)
      - c
3. **delimiter**: Choose Delimiter to split
   - Value type : String
   - Default : ,
4. **na_filter**: 
5. **quoting**: Control field quoting behavior per csv.QUOTE_* constants. If False, quotation mark will be survived.
6. **encoding**: Encoding to use for UTF when reading/writing.
   - Available items
      - utf-8 (default)
      - utf-8-sig
      - euckr
      - ms949
7. **strip_col**: Strip white space in column name

#### Outputs: table

