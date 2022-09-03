# Jupyter Notebook
.ipynb 파일 실행

## Description
본 함수는 Jupyter Notebook(.ipynb file)을 workflow에서 실행한다.

## Properties
### VA

#### OUTPUT
1. **result**: (Notebook) Jupyter Notebook의 결과 출력
#### PARAMETER
1. **Notebook Path**<b style="color:red">*</b>: Jupyter Notebook이 저장된 경로.
	* 경로는 개인화 디렉토리가 아니라 공유 디렉토리에 있어야 함
2. **Kernel**<b style="color:red">*</b>: Jupyter Notebook 에서 실행할 Kernel.
	* Notebook Path 입력 후 Set 버튼 클릭 시 경로가 유효하면 자동 설정