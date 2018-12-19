## Format
### Python
```python
from brightics.function.statistics import correlation
res = correlation(vars = ,method = ,height = ,corr_prec = ,group_by = )
res['result']
```

## Description
"A correlation coefficient is a numerical measure of some type of correlation, meaning a statistical relationship between two variables. The variables may be two columns of a given data set of observations, often called a sample, or two components of a multivariate random variable with a known distribution. Several types of correlation coefficient exist, each with their own definition and own range of usability and characteristics. They all assume values in the range from -1 to +1, where +1 indicates the strongest possible agreement and -1 the strongest possible disagreement. As tools of analysis, correlation coefficients present certain problems, including the propensity of some types to be distorted by outliers and the possibility of incorrectly being used to infer a causal relationship between the variables." 

Reference:
+ <https://en.wikipedia.org/wiki/Correlation_coefficient>

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Input columns
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Method**: Method
   - Available items
      - pearson (default)
      - spearman
      - kendal
3. **Height**: Height
   - Value type : Double
   - Default : 2.5
4. **Precision**: Precision for correlation coefficients.
   - Value type : Integer
   - Default : 2
5. **Group By**: Columns to group by

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **vars**<b style="color:red">*</b>: Input columns
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **method**: Method
   - Available items
      - pearson (default)
      - spearman
      - kendal
3. **height**: Height
   - Value type : Double
   - Default : 2.5
4. **corr_prec**: Precision for correlation coefficients.
   - Value type : Integer
   - Default : 2
5. **group_by**: Columns to group by

#### Outputs
1. **result**: model

