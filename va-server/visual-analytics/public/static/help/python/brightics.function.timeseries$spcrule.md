## Format
### Python
```python
from brightics.function.timeseries import spcrule
res = spcrule(time_col = ,value_col = ,ruleset_id = ,min_sample_cnt = ,filtering = )
res['out_table']
res['out_table2']
```

## Description
Anomaly Detection using Statistical Process Control (SPC) rules.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Time Column**: time column to sort by
2. **Value Column**<b style="color:red">*</b>: value column to execute anomaly detection
   - Allowed column type : Integer, Long, Float, Double, Decimal
3. **Ruleset**: select Statistical Process Control Ruleset.
4. **Minimun sample count**: minimun sample count before execute anomaly detection
   - Value type : Integer
   - Default : 50
5. **remove outliers**: before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)
   - Available items
      - Ture (default)
      - False

#### Outputs: table, table

### Python
#### Inputs: table

#### Parameters
1. **time_col**: time column to sort by
2. **value_col**<b style="color:red">*</b>: value column to execute anomaly detection
   - Allowed column type : Integer, Long, Float, Double, Decimal
3. **ruleset_id**: select Statistical Process Control Ruleset.
4. **min_sample_cnt**: minimun sample count before execute anomaly detection
   - Value type : Integer
   - Default : 50
5. **filtering**: before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)
   - Available items
      - 1 (default)
      - 0

#### Outputs: table, table

