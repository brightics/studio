## Description
This function performs a **for loop** with the **group by** result of the specified column as the source.
```python
// result of group by 
groupby_list = ['setosa', 'virginica', 'versicolor']

// do loop
for myIdx in range(len(groupby_list)):
```

## Properties
1. **Group By**<b style='color:red'>*</b>: Column to group by.
2. **Index Variable**: Name of the count variable used in the Loop.  
This can be used as a variable in a Loop. (**step into** button takes into the Loop)

### USAGE
#### 1. Set Properties
<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/GroupLoop1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

#### 2. Go into the Loop
<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/GroupLoop2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

#### 3. Fill in the contents of the Loop
**Index Variable** can be used as a variable in **Script functions**  
e.g. ${=**enter the variable name**}
<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/GroupLoop3.png'); margin-left: 25px; margin-bottom: 25px;"></div>