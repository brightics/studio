## Format



## Description

시계열 데이터의 프리프로세싱 기능을 제공한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐
 컬럼
   - Allowed column type : Integer, Long, Double
2. **Moving Type**<b style="color:red">*</b>: 시계열 데이터 처리 타입
   - Available items
      - Sliding Window (default)
      - Batch
3. **Step**: 스탭
   - Value type : Integer
   - Default : 1
4. **Calculation Method**<b style="color:red">*</b>: 계산 방법
   - Available items
      - rms
      - mean
      - std
      - var
      - min
      - max
      - median
      - sum
      - mode
5. **Window Size(1 < value <= 10000)**: 윈도우 크기
   - Value type : Integer
   - Default : 30
6. **Index Column**: 인덱스 컬럼
   - Allowed column type : String, Integer, Long, Double

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import preprocessing
res = preprocessing(input_table = ,feature_cols = ,moving_type = ,step = ,calculation_method = ,winsize = ,index_col = )
res['output_table']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐
 컬럼
   - Allowed column type : Integer, Long, Double
2. **moving_type**<b style="color:red">*</b>: 시계열 데이터 처리 타입
   - Available items
      - slide (default)
      - batch
3. **step**: 스탭
   - Value type : Integer
   - Default : 1
4. **calculation_method**<b style="color:red">*</b>: 계산 방법
   - Available items
      - rms
      - mean
      - std
      - var
      - min
      - max
      - median
      - sum
      - mode
5. **winsize**: 윈도우 크기 
   - Value type : Integer
   - Default : 30
6. **index_col**: 인덱스 컬럼
   - Allowed column type : String, Integer, Long, Double

#### Outputs: table

