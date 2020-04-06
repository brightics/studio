## Format
### Python
```python
from brightics.function.io import image_load
res = image_load(path = ,labeling = ,image_col = )
res['out_table']
```

## Description
Load image files.

---

## Properties
### VA
#### Inputs: This function has no input data.

#### Parameters
1. **Input Path**<b style="color:red">*</b>: Directory where the image files exists.
   - Value type : String
2. **Labeling**: Method to add label to image values.
   - Available items
      - Directory (default) Assume the image files are saved as (Input Path)/(Label)/(Image Files).
      - None Assume the image files are saved as (Input Path)/(Image Files). Label values are not added.
3. **Image Column Name**: Column name for image values.
   - Value type : String
   - Default : image

#### Outputs: table

### Python
#### Inputs: This function has no input data.

#### Parameters
1. **path**<b style="color:red">*</b>: Directory where the image files exists.
   - Value type : String
2. **labeling**: Method to add label to image values.
   - Available items
      - dir (default) Assume the image files are saved as (Input Path)/(Label)/(Image Files).
      - none Assume the image files are saved as (Input Path)/(Image Files). Label values are not added.
3. **image_col**: Column name for image values.
   - Value type : String
   - Default : image

#### Outputs: table

