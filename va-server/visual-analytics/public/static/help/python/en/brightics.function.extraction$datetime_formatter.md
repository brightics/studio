## Format
### Python
```python
from brightics.function.extraction import datetime_formatter
res = datetime_formatter(table = ,input_cols = ,display_mode = ,in_format = ,out_format = ,in_language = ,out_language = )
res['out_table']
```

## Description
Change the format of DateTime.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Display Mode**: How to show the result in the table. Append : The format-changed columns are added as derived variables. Replace : The existing DateTime columns are replaced with the format-changed columns. Default: Replace
   - Available items
      - replace (default)
      - append
3. **In Format**: Format of DateTime on In.
4. **Out Format**: Format of DateTime on Out.
5. **In Language**: Country code of DateTime on in-table (en, fr, de, it, ja, ko, zh) default : en
6. **Out Language**: Country code of DateTime on out-table (en, fr, de, it, ja, ko, zh) default : en

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **display_mode**: How to show the result in the table. Append : The format-changed columns are added as derived variables. Replace : The existing DateTime columns are replaced with the format-changed columns. Default: Replace
   - Available items
      - replace (default)
      - append
3. **in_format**: Format of DateTime on In.
4. **out_format**: Format of DateTime on Out.
5. **in_language**: Country code of DateTime on in-table (en, fr, de, it, ja, ko, zh) default : en
6. **out_language**: Country code of DateTime on out-table (en, fr, de, it, ja, ko, zh) default : en

#### Outputs: table

