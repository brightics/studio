## Format

시변환 데이터 차트 생성

## Description

본 함수는 각 피쳐가 서로 상관관계가 있고, 간단한 임계값으로 이상치를 힘든 시변환 데이터의 차트를 그려준다. 

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, table, table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐
컬럼
   - Allowed column type : Integer, Long, Double
2. **Time Column**: 시각 컬럼
   - Allowed column type : String, Integer, Long
3. **Chart Type**<b style="color:red">*</b>: 차트 종류
   - Available items
      - Line Chart (default)
      - Scatter Chart
4. **Event Date(s)**: 날짜 수 (= 생성할 Centroid의 수)

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
1. **feature_cols**<b style="color:red">*</b>: 피쳐
컬럼ures
   - Allowed column type : Integer, Long, Double
2. **time_col**: 시각 컬럼
   - Allowed column type : String, Integer, Long
3. **chart_type**<b style="color:red">*</b>: 차트 종류
   - Available items
      - line (default)
      - scatter
4. **event_date**: 날짜 수 (= 생성할 Centroid의 수)

#### Outputs: model

