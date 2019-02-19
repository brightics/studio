## Description
This function that change global variables

## Properties
1. **String**: string data type
2. **Number**: number data type
3. **Array String Value**: array of string data type
4. **Array Number Value**: array of number data type
5. **Calculation Value**: can be entered another variable
6. **Cell**: choose input data and set row/ column name

## Example
Run "Condition" function with "Set Value" function to change condition by global variables
This example sorted and viewed "iris" data by condition. (If: ASC , Else: DESC)

1. create "Load", "Set Value", "Condition" functions in order
2. add global variable as "var1"
3. set "var1" to 0
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

4. click "Set Value" activity and add variable as "var1"
5. set "var1" to 1
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_5.png'); margin-left: 25px; margin-bottom: 25px;"></div>

6. click "Condition" activity and insert "if" condition as "var1 > 0"
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_6.png'); margin-left: 25px; margin-bottom: 25px;"></div>

7. click "Step Into" button and move inner model(If)
8. set "Input Data" and create "Sort" function
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_8.png'); margin-left: 25px; margin-bottom: 25px;"></div>

9. fill "Sort" function parameters to ascending order
10. set "Return Data"
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_10.png'); margin-left: 25px; margin-bottom: 25px;"></div>

11. click "Else" tab to change inner model
12. set "Input Data" and create "Sort" function like "If"
13. fill "Sort" function parameters to descending order
14. set "Return Data" 
<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_14.png'); margin-left: 25px; margin-bottom: 25px;"></div>

15. click "Step Out" button to move main model
16. run this model and show "condition"'s output that will be sorted as ascending
17. click "Set Value" activity
18. set "var1" to 0
19. run this model and show "condition"'s output that will be sorted as descending