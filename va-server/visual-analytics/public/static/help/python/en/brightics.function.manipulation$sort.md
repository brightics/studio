## Format
Sort the selected columns according to a given rule. 

## Description
Sorting is a process of arranging items systematically according to a specified rule, and is a common operation in many applications. This function sorts specific columns as a given order.

Reference
- <https://en.wikipedia.org/wiki/Sorting>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Sorted output table according to a specified rule.    

#### PARAMETER
1. **Sort Rule**<b style="color:red">*</b>: Columns and sorting type (desc, asc)
   - Allowed column type : Double, Float, Integer, Long, String
2. **Group By**: Columns to group by


### Python
```python
sort(table, input_cols, is_asc, group_by = None)
```
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Sorted output table according to a specified rule.    

#### PARAMETER
1. **input_cols**<b style="color:red">*</b>: Input columns.
   - Allowed column type : Double, Float, Integer, Long, String
2. **is_asc**: Ascending or descending.
   - Type : bool or list[bool]
   - Default / Range: True (True | False)
3. **group_by**: Columns to group by
   - Type : list[str]

## Example
### VA
**<a href="https://www.brightics.ai/docs/ai/v3.6/tutorials/07_data_refine?type=insight" target="_blank">[Related Tutorial]</a>**

**<a href="/static/help/python/sample_model/sort.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/sort.PNG"  width="800px" style="border: 1px solid gray" >

In the tutorial workflow, sample_iris data is used as input of Sort function. The ouput of this function is a sorted output table according to a given rule. The parameter settings used in the function are shown below.

++Parameters++
1. **input_cols**: sepal_length, sepal_width
2. **is_asc**: True, False
3. **group_by**: None


### Python
```
from brightics.function.manipulation import sort
input_table = inputs[0]
res = sort(table = input_table,
		   input_cols = ["sepal_length", "sepal_width"], 
		   is_asc = [True, False], 
		   group_by = None)
output = res['out_table']
```

In this python script, Sort function is applied to the input data to arrange given columns systematically according to a specified rule. 