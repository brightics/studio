## Format
### Python

## Description
This function builds a dataframe from the input values.

---

## Properties
### VA
1. **edit** : The first row are the column names. Column names should consist of alphabets, numbers, and "_". The column names should start with an alphabet letter. The other rows are the input data.
2. **Columns** : After entering the input data, choose the type for each column.

### Scala
1. **data-array** : Array[Array[Any]] The input data. Each array in the whole array is a row.
2. **column-types** : Array[String] The column types.
3. **column-names** : Array[String] The column names.

#### Outputs
1. **out_table**: table