## Format
### Python
```python
from brightics.function.statistics import oneway_anova
res = oneway_anova(response_cols = ,factor_col = )
res['result']
```

## Description
In statistics, one-way analysis of variance (abbreviated one-way ANOVA) is a technique that can be used to compare means of two or more samples (using the F distribution). This technique can be used only for numerical response data, the 'Y', usually one variable, and numerical or (usually) categorical input data, the 'X', always one variable, hence 'one-way'. 

Reference:
+ <https://en.wikipedia.org/wiki/One-way_analysis_of_variance>

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Response columns
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Factor column

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Response columns
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Factor column

#### Outputs
1. **result**: model

