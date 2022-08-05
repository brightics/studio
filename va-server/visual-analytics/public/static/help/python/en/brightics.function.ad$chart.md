## Format



## Description
Build a chart based on time varying data in scenarios where variables correlate to each other and it is difficult to get a reliability of detected anomalies using a simple threshold.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, table, table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Time Column**: Time Column
   - Allowed column type : String, Integer, Long
3. **Chart Type**<b style="color:red">*</b>: Chart Type
   - Available items
      - Line Chart (default)
      - Scatter Chart
4. **Event Date(s)**: Event Date(s) to form as well as the number of centroids to generate.

#### Outputs: model

### Python

#### USAGE
```python
from brightics.function.ad import chart
res = chart(input_table_score = ,input_table_alarm = ,input_table_cl = ,feature_cols = ,time_col = ,chart_type = ,event_date = )
res['output_model']
```

#### Inputs: table, table, table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **time_col**: Time Column
   - Allowed column type : String, Integer, Long
3. **chart_type**<b style="color:red">*</b>: Chart Type
   - Available items
      - line (default)
      - scatter
4. **event_date**: Event Date(s) to form as well as the number of centroids to generate.

#### Outputs: model

