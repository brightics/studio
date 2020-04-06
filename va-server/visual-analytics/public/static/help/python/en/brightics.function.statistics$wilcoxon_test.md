## Format
### Python
```python
from brightics.function.statistics import wilcoxon_test
res = wilcoxon_test(table = ,response_col = ,factor_col = ,zero_method = ,correction = ,group_by = )
res['result']
```

## Description
The Wilcoxon signed-rank test is a non-parametric statistical hypothesis test used to compare two related samples, matched samples, or repeated measurements on a single sample to assess whether their population mean ranks differ.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Column**<b style="color:red">*</b>: Response column
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
3. **Zero Method**: Treatment method
   - Available items
      - pratt
      - wilcox (default)
      - zsplit
4. **Correction**: If True, apply continuity correction by adjusting the Wilcoxon rank statistic by 0.5 towards the mean value when computing the z-statistic
5. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_col**<b style="color:red">*</b>: Response column
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
3. **zero_method**: Treatment method
   - Available items
      - pratt
      - wilcox (default)
      - zsplit
4. **correction**: If True, apply continuity correction by adjusting the Wilcoxon rank statistic by 0.5 towards the mean value when computing the z-statistic
5. **group_by**: Columns to group by

#### Outputs: model

