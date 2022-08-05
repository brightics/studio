# Join
Performs SQL style Join operations.

## Description
Performs SQL style Join operations.



## Properties
### VA
#### INPUT
1. **left_table**<b style="color:red">*</b>:  (Table) Left table to be joined.
2. **right_table**<b style="color:red">*</b>: (Table) Right table to be joined.
#### OUTPUT
1. **table**: (Table) Join result.
#### PARAMETER
1. **Join Type**<b style="color:red">*</b>: SQL join type.
2. **Left Keys**<b style="color:red">*</b>: Reference columns in the left(first) table.
3. **Right Keys**<b style="color:red">*</b>: Reference columns in the right(second) table.
4. **Left Suffix**: Suffix for the columns from the left(first) table.
5. **Right Suffix**: Suffix for the columns from the right(second) table.
6. **Sort**: Sort the resulting table on the reference columns lexicographically.


### Python
#### USAGE
```
join(left_table =, right_table =, left_on =, right_on =, how =, lsuffix =, rsuffix =, sort =)
```

#### INPUT
1. **left_table**<b style="color:red">*</b>:  (Table) Left table to be joined.
2. **right_table**<b style="color:red">*</b>: (Table) Right table to be joined.
#### OUTPUT
1. **table**: (Table) Join result.
#### PARAMETER
1. **how**<b style="color:red">*</b>: SQL join type.
	* Type: *str*
	* Default / Range: outer ( outer | left | right | inner | left_exclude | right_exclude )
2. **left_on**<b style="color:red">*</b>: Reference columns in the left(first) table.
   - Value type : _list_[_str_] 
3. **right_on**<b style="color:red">*</b>: Reference columns in the right(second) table.
   - Value type : _list_[_str_] 
4. **lsuffix**: Suffix for the columns from the left(first) table.
   - Value type : _str_
   - Default value: _left
5. **rsuffix**: Suffix for the columns from the right(second) table.
   - Value type : _str_
   - Default value: _right
6. **sort**: Sort the resulting table on the reference columns lexicographically.
   - Type : _bool_
   - Default / Range: False ( True | False)
   
## Example
### VA

**<a href="/static/help/python/sample_model/Join.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/join.PNG"  width="800px" style="border: 1px solid gray" >



<br>In this tutorial workflow, two tables are joined with the specified join condition.

++Parameters++
1. **Join Type**<b style="color:red">*</b>: 'Inner Join'
2. **Left Keys**<b style="color:red">*</b>: 'species'
3. **Right Keys**<b style="color:red">*</b>: 'species'
4. **Left Suffix**: '_left'
5. **Right Suffix**: '_right'
6. **Sort**: False 


### Python

```
from brightics.function.transform import join
res = join(left_table=inputs[0], right_table=inputs[1],
           left_on='species', right_on='species', how='inner',
           lsuffix='_left', rsuffix='_right', sort=False)
table = res['table'] 
```

<br>In this Python script, two tables are joined with the specified join condition.

