## Format
### Python
```python
from brightics.function.transform import join
res = join(left_on = ,right_on = ,how = ,lsuffix = ,rsuffix = ,sort = )
res['table']
```

## Description
Merge DataFrame objects by performing a database-style join operation by columns.

---

## Properties
### VA
#### Inputs
1. **left_table**: table
2. **right_table**: table

#### Parameters
1. **Join Type**<b style="color:red">*</b>: How to handle the operation of the two objects.
2. **Left Keys**<b style="color:red">*</b>: Columns to join on in the left(first) table.
3. **Right Keys**<b style="color:red">*</b>: Columns to join on in the right(second) table.
4. **Left Suffix**: Left Suffix.
   - Value type : String
5. **Right Suffix**: Right Suffix.
   - Value type : String
6. **Sort**: Order result table lexicographically by the join key.

#### Outputs
1. **table**: table

### Python
#### Inputs
1. **left_table**: table
2. **right_table**: table

#### Parameters
1. **left_on**<b style="color:red">*</b>: Columns to join on in the left(first) table.
2. **right_on**<b style="color:red">*</b>: Columns to join on in the right(second) table.
3. **how**: How to handle the operation of the two objects.
4. **lsuffix**: Left Suffix.
   - Value type : String
5. **rsuffix**: Right Suffix.
   - Value type : String
6. **sort**: Order result table lexicographically by the join key.

#### Outputs
1. **table**: table

