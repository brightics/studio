## Format

랜덤 포레스트 기법 기반 이상감지 


## Description

랜덤 포레스트 기법 기반 이상감지 모델을 학습한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: 신뢰 수준
   - Value type : Double
   - Default : 0.01
   - Range : 0 < value < 1
3. **Number of tree(s)(1 < value <= 100)**: 트리 수
   - Value type : Integer
   - Default : 10
   - Range : 1 < value <= 100
4. **Number of max feature(s)(0 <= value < n_feature)**: 최적 분리를 찾기위한 최대 피쳐 수. 값이 0이면 피쳐개수-1이 설정됨.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature
5. **Maximum depth(0 <= value < n_features^2)**: 트리 최대 깊이. 값이 0이면 모든 노드가 순수해질 때까지 깊이를 확장한다.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature^2

#### Outputs: table, table, model

### Python

#### USAGE
```python
from brightics.function.ad import randomForestTrain
res = randomForestTrain(input_table = ,feature_cols = ,alpha = ,ntree = ,max_features = ,max_depth = )
res['output_table_score']
res['output_table_cl']
res['output_model']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **alpha**: 신뢰 수준
   - Value type : Double
   - Default : 0.01
   - Range : 0 < value < 1
3. **ntree**: 트리 수
   - Value type : Integer
   - Default : 10
   - Range : 1 < value <= 100
4. **max_features**: 최적 분리를 찾기위한 최대 피쳐 수. 값이 0이면 피쳐개수-1이 설정됨.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature
5. **max_depth**: 트리 최대 깊이. 값이 0이면 모든 노드가 순수해질 때까지 깊이를 확장한다.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature^2

#### Outputs: table, table, model

