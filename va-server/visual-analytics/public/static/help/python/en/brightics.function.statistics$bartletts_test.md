## Format
### Python
```python
from brightics.function.statistics import bartletts_test
res = bartletts_test(table = ,response_cols = ,factor_col = )
res['result']
```

## Description
"In statistics, Bartlett's test (see Snedecor and Cochran, 1989) is used to test if k samples are from populations with equal variances. Equal variances across populations is called homoscedasticity or homogeneity of variances. Some statistical tests, for example the analysis of variance, assume that variances are equal across groups or samples. The Bartlett test can be used to verify that assumption.Bartlett's test is sensitive to departures from normality. That is, if the samples come from non-normal distributions, then Bartlett's test may simply be testing for non-normality. Levene's test and the Brown Forsythe test are alternatives to the Bartlett test that are less sensitive to departures from normality. The test is named after Maurice Stevenson Bartlett." 

Reference:
+ <https://en.wikipedia.org/wiki/Bartlett%27s_test>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor

#### Outputs: model

