## Format
### Python
```python
from brightics.function.statistics import correlation
res = correlation(table = ,vars = ,method = ,display_plt = ,height = ,corr_prec = ,group_by = )
res['result']
```

## Description
"A correlation coefficient is a numerical measure of some type of correlation, meaning a statistical relationship between two variables. The variables may be two columns of a given data set of observations, often called a sample, or two components of a multivariate random variable with a known distribution. Several types of correlation coefficient exist, each with their own definition and own range of usability and characteristics. They all assume values in the range from -1 to +1, where +1 indicates the strongest possible agreement and -1 the strongest possible disagreement. As tools of analysis, correlation coefficients present certain problems, including the propensity of some types to be distorted by outliers and the possibility of incorrectly being used to infer a causal relationship between the variables." 

Reference:
+ <https://en.wikipedia.org/wiki/Correlation_coefficient>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Method**: Method.
   - Available items
      - pearson (default)
      - spearman
      - kendall
3. **Display Plots**: Display Plots
4. **Height**: Height of correlation matrix.
   - Value type : Double
   - Default : 2.5
5. **Precision**: Precision for correlation coefficients.
   - Value type : Integer
   - Default : 2
6. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **vars**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **method**: Method.
   - Available items
      - pearson (default)
      - spearman
      - kendall
3. **display_plt**: Display Plots
4. **height**: Height of correlation matrix.
   - Value type : Double
   - Default : 2.5
5. **corr_prec**: Precision for correlation coefficients.
   - Value type : Integer
   - Default : 2
6. **group_by**: Columns to group by

#### Outputs: model

