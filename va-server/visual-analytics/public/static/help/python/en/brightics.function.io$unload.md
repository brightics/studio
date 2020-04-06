## Format
### Python
```python
from brightics.function.io import unload
res = unload(table = ,partial_path = ,mode = )

```

## Description
This function writes a table as a parquet in the repository for brightics.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Path**<b style="color:red">*</b>: Relative path.
2. **Unload mode**<b style="color:red">*</b>: Overwrite or append data to existing file.
   - Available items
      - Overwrite (default)
      - Append

#### Outputs: This function has no output data.

### Python
#### Inputs: table

#### Parameters
1. **partial_path**<b style="color:red">*</b>: Relative path.
2. **mode**<b style="color:red">*</b>: Overwrite or append data to existing file.
   - Available items
      - overwrite (default)
      - append

#### Outputs: This function has no output data.

