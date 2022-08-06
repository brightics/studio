## Format
Generate a new column based on a given formula. 

## Description
This function generates a new column based on a given formula.

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Output table. It contains the input table columns and a new column based on a given formula. 

#### PARAMETER
1. **Add Column**<b style="color:red">*</b>:
   - **New Column Name**<b style="color:red">*</b> : Name of the new column to be added.
   - **New Column Type**<b style="color:red">*</b> : Type of the new column.
   - **Expression Type**<b style="color:red">*</b> : Type of the expression.
   - **Condition**<b style="color:red">*</b> : Condition Expressions and values.

### Python
```python
add_expression_column_if(table, expr_type = "sqlite", new_col, conditions, values, else_value)
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Output table. It contains the input table columns and a new column based on a given formula. 

#### PARAMETER
1. **new_col**<b style="color:red">*</b> : Name of the new column to be added.
    - Type: str
2. **expr_type**<b style="color:red">*</b> : Type of the expression.
    - Type: str
    - Default / Range: sqlite (sqlite | python)
3. **conditions**<b style="color:red">*</b> : Condition Expressions.
    - Type: str
4. **values**<b style="color:red">*</b> : Condition Values.
    - Type: str
5. **else_value**<b style="color:red">*</b> : Condition Values.
    - Type: str    

## Example
### VA
**<a href="https://www.brightics.ai/docs/ai/v3.6/tutorials/101_derived_variables_month_weekday?type=insight" target="_blank">[Related Tutorial]</a>**

**<a href="/static/help/python/sample_model/add_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_column.PNG"  width="800px" style="border: 1px solid gray" >

In the tutorial workflow, sample_iris data is used as input of Add Column function. The output of this function is an output table in which a new column is added according to a given formula. The parameter settings used in the function are shown below.

++Parameters++
1. **new_col**: isVirginica
2. **expr_type**: sqlite
3. **conditions**: species == 'virginica'
4. **values**: True
5. **else_value**: False


### Python
```
from brightics.function.extraction import add_expression_column_if
input_table = inputs[0]
res = add_expression_column_if(table = input_table, 
			       expr_type = "sqlite",
			       new_col = "isVirginica",
			       conditions = ["species == 'virginica'"],
			       values = "True",
			       else_value = "False")
output = res['out_table']
```

In this python script, Add Column function is applied to the input data to generate a new column based on a given formula. 