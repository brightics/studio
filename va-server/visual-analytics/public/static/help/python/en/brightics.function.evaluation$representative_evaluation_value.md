
## Format
A function for the accumulation of evaluation results into Model Manager 

## Description

A function for the accumulation of evaluation results into Model Manager 

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) A table that contains evaluation result.

#### PARAMETER
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
   

### Python
#### USAGE

```
representative_evaluation_value(table = ,input_col = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) A table that contains a label column and a column for probability estimates of the positive class.
#### PARAMETER
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double


## Example


### Python

```
from brightics.function.evaluation import representative_evaluation_value
res = representative_evaluation_value(table = ,input_col = )
```

