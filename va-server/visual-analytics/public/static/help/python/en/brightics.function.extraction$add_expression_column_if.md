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
1. **out_table**: (Table) Output table. It contains the input table columns and a new column based on a given formula. 

#### PARAMETER
1. **Add Column**<b style="color:red">*</b>: Settings for adding new columns.
   - **New Column Name**<b style="color:red">*</b> : Name of the new column to be added.
   - **New Column Type**<b style="color:red">*</b> : Type of the new column.
   - **Expression Type**<b style="color:red">*</b> : Type of the expression.
   - **Condition**<b style="color:red">*</b> : Condition Expressions and values.

### Python
#### USAGE
```
add_expression_column_if(table = , expr_type = , new_col = , conditions = , values = , else_value = )
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

**<a href="/static/help/python/sample_model/add_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_column.PNG"  width="800px" style="border: 1px solid gray" >

In the tutorial workflow, sample_iris data is used as input of Add Column function. The output of this function is an output table in which a new column is added according to a given formula. The parameter settings used in the function are shown below.

++Parameters++
1. **New Column Name**<b style="color:red">*</b>: isVirginica
2. **New Column Type**<b style="color:red">*</b>: String
3. **Expression Type**<b style="color:red">*</b>: SQLite
4. **Condition**<b style="color:red">*</b>: species == 'virginica'


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