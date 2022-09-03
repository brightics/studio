# Fast Query Executor
This function returns a SQL Query result.

## Description
This function returns a SQL Query result. 


## List of query examples

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





## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Tables to execute a query.
#### OUTPUT
1. **out_table**: (Table) Sql query result.
#### PARAMETER
2. **SQL**<b style="color:red">*</b>: SQL statement 


### Python
#### USAGE
```
sql_execute2(tables = , query = )
```

## Example
### VA

**<a href="/static/help/python/sample_model/Fast_Query_Executor.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/fast_query_executor.PNG"  width="800px" style="border: 1px solid gray" >

<br>In this tutorial workflow, we executed the following SQL query statememt in sample iris table.
<br> """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
        where sepal_length > 3 group by #{DF(0)}.species"""


### Python
```
from brightics.function.transform import sql_execute2
stmt = """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
          where sepal_length > 3 group by #{DF(0)}.species"""
res = sql_execute2(tables=[inputs[0]], query=stmt)
table = res['out_table']
```

<br>In this Python script, we executed the following SQL query statememt in sample iris table.
<br> """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
        where sepal_length > 3 group by #{DF(0)}.species"""

