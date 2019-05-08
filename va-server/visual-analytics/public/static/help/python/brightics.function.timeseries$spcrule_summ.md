## Format
### Python
```python
from brightics.function.timeseries import spcrule_summ
res = spcrule_summ(time_col = ,value_col = ,ruleset_id = ,min_sample_cnt = ,filtering = )
res['out_table']
res['out_table2']
```

## Description
Anomaly Detection using Statistical Process Control (SPC) rules with summary.

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Time Column**<b style="color:red">*</b>: time column to sort by
2. **Value Column**<b style="color:red">*</b>: value column to execute anomaly detection
   - Allowed column type : Integer, Long, Float, Double, Decimal
3. **Ruleset**<b style="color:red">*</b>: select Statistical Process Control Ruleset.
4. **Minimun sample count**: minimun sample count before execute anomaly detection
   - Value type : Integer
   - Default : 50
5. **remove outliers**: Ignore summary information and calculate summary again. Before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)
   - Available items
      - Ture
      - False (default)

#### Outputs: table, table

### Python
#### Inputs: table, table

#### Parameters
1. **time_col**<b style="color:red">*</b>: time column to sort by
2. **value_col**<b style="color:red">*</b>: value column to execute anomaly detection
   - Allowed column type : Integer, Long, Float, Double, Decimal
3. **ruleset_id**<b style="color:red">*</b>: select Statistical Process Control Ruleset.
4. **min_sample_cnt**: minimun sample count before execute anomaly detection
   - Value type : Integer
   - Default : 50
5. **filtering**: Ignore summary information and calculate summary again. Before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)
   - Available items
      - 1
      - 0 (default)

#### Outputs: table, table

