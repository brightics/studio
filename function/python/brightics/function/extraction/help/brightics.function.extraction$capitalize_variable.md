## Format
### Python
```python
from brightics.function.extraction import capitalize_variable
res = capitalize_variable(input_cols = ,replace = ,out_col_suffix = )
res['out_table']
```

## Description
Capitalize Variable returns a copy of the string in which all case-based characters have been uppercased or lowercased. In uppercase mode, the method converts all uppercase characters in a string into lowercase characters and returns it. In lowercase mode, the method converts all lowercase characters in a string into uppercase characters and returns it.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: 
   - Allowed column type : String
2. **Replace Mode**: Uppercase / Lowercase (default = Uppercase)
   - Available items
      - Uppercase (default)
      - Lowercase 
3. **Suffix of Out Column Name **: Suffix of the input column name to be newly generated (default = _upper for Uppercase mode, _lower for Lowercase mode)
   - Value type : String
   - Default : _upper (or _lower)

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: 
   - Allowed column type : String
2. **replace**: Uppercase / Lowercase (default = Uppercase)
   - Available items
      - upper (default)
      - lower
3. **out_col_suffix**: Suffix of the input column name to be newly generated (default = _upper for Uppercase mode, _lower for Lowercase mode)
   - Value type : String
   - Default : _upper (or _lower)

#### Outputs
1. **out_table**: table

