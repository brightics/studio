## Format
Filter a data based on a given formula. 

## Description
Filter is a higher-order function that processes a data in some order to produce a new data containing those elements of the original data for which a given predicate returns the boolean value true. Filter function generates a new data based on a given formula.

Reference
- <https://en.wikipedia.org/wiki/Filter_(higher-order_function)>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Filtered output table according to a specified rule. 

#### PARAMETER
1. **Condition**<b style="color:red">*</b> : Choose main operators, columns, operators and operands.


### Python

#### USAGE
```
simple_filter(table =, main_operator =, input_cols =, operators =, operands = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Data in a Table.

#### OUTPUT
1. **table**: (Table) Filtered output table according to a specified rule. 

#### PARAMETER
1. **main_operator**<b style="color:red">*</b>: Main operators for multiple filter formulas.
    - Type: str
    - Default / Range: And (And | Or)
2. **input_cols**<b style="color:red">*</b>: Columns to apply the filter formula.
    - Type: list[str]
3. **operators**<b style="color:red">*</b>: Operators for the filter formula.
    - Type: list[str]
    - Default / Range: == (== | != | In | Not In | Starts With | Ends With | Contain | Not Contain)
4. **operands**<b style="color:red">*</b>: Operands for the filter formula. 
    - Type: list[str]


## Example
### VA

**<a href="/static/help/python/sample_model/filter.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/filter.PNG"  width="800px" style="border: 1px solid gray" >

In the tutorial workflow, sample_iris data is used as input of Filter function. The ouput of this function is a filtered output table according to a given rule. The parameter settings used in the function are shown below.

++Parameters++
1. **Condition**<b style="color:red">*</b>: And, species, ==, 'setosa'


### Python
```
from brightics.function.manipulation import simple_filter
input_table = inputs[0]
res = simple_filter(table = input_table,
  		    main_operator = "and", 
	            input_cols = ["species"], 
	            operators = ["=="], 
		    operands = ["'setosa'"])
output = res['out_table']
```

In this python script, Filter function is applied to the input data to generate a new data based on a given formula. 