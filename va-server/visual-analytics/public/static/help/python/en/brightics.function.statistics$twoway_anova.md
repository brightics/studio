## Format
### Python
```python
from brightics.function.statistics import twoway_anova
res = twoway_anova(table = ,response_cols = ,factor_cols = ,group_by = )
res['result']
```

## Description
In statistics, the Two-way analysis of variance (ANOVA) is an extension of the one-way ANOVA that examines the influence of two different categorical independent variables on one continuous dependent variable. The two-way ANOVA not only aims at assessing the main effect of each independent variable but also if there is any interaction between them.

Reference:
<https://en.wikipedia.org/wiki/Two-way_analysis_of_variance>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Column**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String
3. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_cols**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String
3. **group_by**: Columns to group by

#### Outputs: model

