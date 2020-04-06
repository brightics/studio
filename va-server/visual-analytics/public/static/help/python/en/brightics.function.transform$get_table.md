## Format
### Python
```python
from brightics.function.transform import get_table
res = get_table(model = ,key_list = ,index_column = ,index_column_name = )
res['table']
```

## Description
Generate a table from a table element contained in some json object.

---

## Properties
### VA
#### Inputs: model

#### Parameters
1. **Key**<b style="color:red">*</b>: Key. ex) ['a','b','c'] for json_object['a']['b']['c']
2. **Index Column**<b style="color:red">*</b>: Whether to insert index column front.
3. **Index Column Name**: Column name for index.
   - Value type : String
   - Default : index

#### Outputs: table

### Python
#### Inputs: model

#### Parameters
1. **key_list**<b style="color:red">*</b>: Key. ex) ['a','b','c'] for json_object['a']['b']['c']
2. **index_column**<b style="color:red">*</b>: Whether to insert index column front.
3. **index_column_name**: Column name for index.
   - Value type : String
   - Default : index

#### Outputs: table

