## Format
### Python
```python
from brightics.function.transform import sql_execute2
res = sql_execute2(tables = ,query = )
res['out_table']
```

## Description
This function returns a SQL Query result. 

- The function is currently under development. Implemented SQL Syntax and functions are listed below. 
- Currently, we have some SQL-parsing issues due to the low version of the package: apache-calcite. Most of the bugs will be resolved later by upgrading the package to a higher version.

- group by column issue
  - For the remedy, please state group by columns with its table name.
  - do: select species from #{DF(0)} group by #{DF(0)}.species
  - not: select species from #{DF(0)} group by species

- operation with no table issue
  - For the remedy, please state an input table name with from clause even if the table is irrelevant to operation.
  - do: select 4 as a, 4/3, 4/3.0 as c, 4+7 as d, 5-2 from #{DF(0)}
  - not: select 4 as a, 4/3, 4/3.0 as c, 4+7 as d, 5-2

## List of implemented Syntax and functions.

### SQL Syntax

##### select
- ex: select *  from  #{DF(0)}
- ex: select col1, col2 as secondCol  from  #{DF(0)}

##### limit
- ex: select *  from  #{DF(0)} limit 5

##### where
- ex: select * from  #{DF(0)} where sepal_length>3 

##### order by
- ex: select * from  #{DF(0)} order by col1 asc, col2 desc

##### group by
- ex: select species from #{DF(0)} group by #{DF(0)}.species

##### distinct
- ex: select distinct sepal_length from #{DF(0)}  

### SQL Arithmetic Operators

##### + (PLUS)
##### - (MINUS)
##### * (TIMES)
##### / (DIVIDE, FLOORDIVIDE)

- ex: select 4 as a, 4/3, 4/3.0 as c, 4+7 as d, 5-2 from #{DF(0)}

### SQL Comparison Operators

##### = (EQUALS)
##### < (LESS_THAN)
##### > (GREATER_THAN)
##### <= (LESS_THAN_OR_EQUAL)
##### >= (GREATER_THAN_OR_EQUAL)
##### <> (NOT_EQUALS)

- ex: select sepal_length = sepal_width, sepal_length < sepal_width, sepal_length >= sepal_width from #{DF(0)}



### SQL Logical Operators

##### AND 
##### OR
##### BETWEEN
##### NOT

- ex: select * from {DF(0)} where g='g1' or a>2 and c=5
- ex: select * from {DF(0)} where species='setosa' or sepal_length>5 or not (sepal_width>4) 
- ex: select * from {DF(0)} where sepal_length between 4 and 5



### SQL Join

##### CROSS JOIN
##### INNER JOIN with '=' condition on two columns
##### LEFT JOIN with '=' condition on two columns
##### RIGHT JOIN with '=' condition on two columns
##### FULL OUTER JOIN with '=' condition on two columns

- ex: select * from #{DF(1)} cross join #{DF(2)}
- ex: select * from #{DF(0)} inner join #{DF(1)} on #{DF(0)}.b = #{DF(1)}.a



### Aggregate Functions

##### COUNT(*)
##### COUNT
##### MAX
##### MIN
##### AVG
##### SUM

- ex: select count(*), count(g), max(c), min(c), avg(c) from #{DF(0)}


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
