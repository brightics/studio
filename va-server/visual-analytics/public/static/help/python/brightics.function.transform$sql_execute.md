## Format
### Python
```python
from brightics.function.transform import sql_execute
res = sql_execute(tables = ,query = )
res['out_table']
```

## Description
This function returns value for executed SQL Query. For a description of core functions, see <https://www.sqlite.org/index.html>. UDF(User defined function)s are introduced in 'Summary' part of the help page.

---

## Summary


### Aggregate Functions

#### variance, var_pop
##### - description : The variance of an input column.
##### - ex : select variance(sepal_length) as var_sepal_length from  #{DF(0)}
##### - ex : select var_pop(sepal_length) as var_pop_sepal_length from  #{DF(0)}

#### var_samp
##### - description : The sample variance of an input column.
##### - ex : select var_samp(sepal_length) as var_samp_sepal_length from  #{DF(0)}

#### stddev_pop
##### - description : The standard deviation of an input column.
##### - ex : select stddev_pop(sepal_length) as stddev_pop_sepal_length from  #{DF(0)}

#### stddev_samp
##### - description : The sample standard deviation of an input column.
##### - ex : select stddev_samp(sepal_length) as stddev_samp_sepal_length from  #{DF(0)}

#### covar_pop
##### - description : The covariance of input columns.
##### - ex : select covar_pop(sepal_length, sepal_width) as covar_pop_sepal_length_sepal_width from  #{DF(0)}

#### covar_samp
##### - description : The sample covariance of input columns.
##### - ex : select covar_samp(sepal_length, sepal_width) as covar_samp_sepal_length_sepal_width from  #{DF(0)}

#### percentile
##### - description : The percentile of an input column.
##### - ex : select percentile(sepal_length, 35) as percentile_sepal_length from  #{DF(0)}

#### collect_list
##### - description : List of elements of an input column. (Duplication allowed)
##### - ex : select collect_list(sepal_length) as collect_list_sepal_length from  #{DF(0)}

#### collect_set
##### - description : Set of elements of an input column. (Duplication not allowed)
##### - ex : select collect_set(sepal_length) as collect_set_sepal_length from  #{DF(0)}



### Constant Functions

#### e
##### - description : Euler's number.
##### - ex : select sepal_length + e() from #{DF(0)}

#### pi
##### - description : Pi.
##### - ex : select sepal_length + pi() from  #{DF(0)}



### Lambda Functions

#### log, ln
##### - description : These are the natural logarithm functions which evaluates log_e() where e is the Euler's number.
##### - ex : select log(sepal_length), ln(sepal_length), log(10), ln(10) from  #{DF(0)}

#### log10
##### - description : This is the common logarithm function which evaluates log_10().
##### - ex : select log10(sepal_length), log10(10) from  #{DF(0)}

#### log2
##### - description : This function evaluates log_2().
##### - ex : select log2(sepal_length), log2(10) from  #{DF(0)}

#### exp
##### - description : This is the exponential function which evaluates e^() where e is the Euler's number.
##### - ex : select exp(sepal_length), exp(10) from  #{DF(0)}

#### exp2
##### - description : This function evaluates 2^().
##### - ex : select exp2(sepal_length), exp2(10) from  #{DF(0)}

#### sqrt
##### - description : This is the square root function.
##### - ex : select sqrt(sepal_length), sqrt(2) from  #{DF(0)}

#### ceil
##### - description : This is the ceiling function.
##### - ex : select ceil(sepal_length), ceil(-1.5) from  #{DF(0)}

#### floor
##### - description : This is the floor function.
##### - ex : select floor(sepal_length), floor(-1.5) from  #{DF(0)}

#### sign
##### - description : This is the sign function.
##### - ex : select sign(sepal_length), sign(-1.5) from  #{DF(0)}

#### factorial
##### - description : This is the factorial function.
##### - ex : select factorial(ceil(sepal_length)), factorial(5) from  #{DF(0)}

#### pow
##### - description : This function works this way, pow(a, b) = a^b for real numbers a and b.
##### - ex : select pow(sepal_length, sepal_width), pow(2, 3) from  #{DF(0)}

#### ljust, rjust
##### - description : This function left(right)-justify a string in a field of given width.
##### - ex : select ljust(sepal_length, 7, '*'), ljust('abc', 7, '*'), rjust(sepal_length, 5, '*'), rjust('abc', 5, '*') from #{DF(0)}

#### is_null
##### - description : This function detects missing data and returns boolean values.
##### - ex : select is_null(sepal_length), is_null(5), is_null(null) from #{DF(0)}



### Regular Expression Related Functions

#### regexp
##### - description : This function finds a pattern from a string or a string type column.
##### - ex : select regexp('set', species), regexp('setosa2', species), regexp('a', 'a b'), regexp('a b', 'a') from #{DF(0)}

#### regexp_replace
##### - description : This function finds a pattern from a string or a string type column, and replace such pattern.
##### - ex : select regexp_replace(species, 'setosa', 'setosa_2'), regexp_replace('a b c', 'a', 'value') from #{DF(0)}



### Datetime Related Functions

#### datediff
##### - description : This function evaluates the difference between two date valued columns.
##### - ex : select datediff(column1, column2) from #{DF(0)}



### Array Related Functions

#### concat_ws
##### - description : This function concatenates strings by an input seperator.
##### - ex : select concat_ws('^', column) from  #{DF(0)}

#### split
##### - description : This function separates a string by an input seperator.
##### - ex : select split(species, 't') from  #{DF(0)}

#### size
##### - description : This function returns a size of array-like value in an input column. 
##### - ex : select size(column) from #{DF(0)}

---

## Properties
### VA
#### Inputs: tables

#### Parameters
1. **SQL**<b style="color:red">*</b>: SQL Query

#### Outputs: table

### Python
#### Inputs: tables

#### Parameters
1. **query**<b style="color:red">*</b>: SQL Query
      
#### Outputs: table
