
## Format
Excel 파일을 읽어 테이블을 만드는 함수 

## Description

본 함수는 지정된 위치의 Excel 파일을 읽고, 이를 Brightics에서 사용 할 수 있는 테이블로 변환한다.   

## Properties
### VA
#### INPUT
인풋 없음 
#### OUTPUT
1. **out-model**:(Table) Excel 파일로 부터 생성된 테이블.

#### Parameters
1. **Path of excel file**<b style="color:red">*</b>: 엑셀 파일의 위치 및 파일명. 

2. **Sheet index**: 대상 데이터를 가진 엑셀 파일 내 Sheet 인덱스. 인덱스는 0부터 시작한다. 

   
   
### Python
#### USEAGE

```
res = read_excel(path = ,sheet_index = )
```

#### INPUT
인풋 없음 
#### OUTPUT
1. **out-model**:(Table) Excel 파일로 부터 생성된 테이블.

#### Parameters
1. **path**<b style="color:red">*</b>: 엑셀 파일의 위치 및 파일명. 
   - Value type : String
2. **sheet_index**: 대상 데이터를 가진 엑셀 파일 내 Sheet 인덱스. 인덱스는 0부터 시작한다. 
   - Value type : Integer
   - Default : 0




