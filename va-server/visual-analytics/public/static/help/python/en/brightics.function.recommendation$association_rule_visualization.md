## Format
### Python
```python
from brightics.function.recommendation import association_rule_visualization
res = association_rule_visualization(table = ,option = ,display_rule_num = ,figure_size_muliplier = ,edge_length_scaling = ,node_size_scaling = ,font_size = ,group_by = )
res['model']
```

## Description
Visualize Association Rule

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Option**: 
   - Available items
      - single to single
      - multiple to single (default)
      - multiple to multiple
2. **Display Rule Number (except Single to Single)**: 
3. **Figure Size Multiplier**: 
   - Value type : Double
   - Default : 1 (0 < value)
4. **Edge Length Multiplier**: Optimize node distance
   - Value type : Double
   - Default : 1 (0 < value)
5. **Node Size Multiplier**: 
   - Value type : Double
   - Default : 1 (0 < value)
6. **Font Size**: Font Size
   - Value type : Double
   - Default : 10 (0 < value)
7. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **option**: 
   - Available items
      - single_to_single
      - multiple_to_single (default)
      - multiple_to_multiple
2. **display_rule_num**: 
3. **figure_size_muliplier**: 
   - Value type : Double
   - Default : 1 (0 < value)
4. **edge_length_scaling**: Optimize node distance
   - Value type : Double
   - Default : 1 (0 < value)
5. **node_size_scaling**: 
   - Value type : Double
   - Default : 1 (0 < value)
6. **font_size**: Font Size
   - Value type : Double
   - Default : 10 (0 < value)
7. **group_by**: Columns to group by

#### Outputs: model

