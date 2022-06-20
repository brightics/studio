If you have downloaded Brightics Studio windows version v1.1 2020.07,
please use the following steps to handle infected files of Brightics Studio.

Brightics Studio 사용자께 안내 말씀드립니다.
BrighticsStudio-v1.1-2020.07-windows.exe에 악성코드 감염이 발견되어 조치 방법을 안내해 드립니다.

### [For V3 Antivirus program user] <br>
### [V3 백신 프로그램 사용자]
1. Update the antivirus program. <br>
   백신 업데이트 <br>
2. Run Detailed Scan. <br>
   정밀검사 수행

### [How to remove if not using V3 Antivirus program]
### [V3 백신을 사용하지 않을시 삭제방법]


1. Remove brightics-studio folder. (Default installation path is `C:\brightics-studio`) <br>
   설치한 `brightics-studio` 폴더 전체를 삭제해주세요. (기본 설치 경로는 `C:\brightics-studio` 입니다.)
![1](img/1_e.png)

2. Open File Explorer and type `%userprofile%` in the address bar. <br>
   파일 탐색기를 열고 주소 표시창에 `%userprofile%` 을 입력해주세요.
![2](img/2_e.png)

3. If you find `Brightics Studio Updater.exe` file, delete this file. <br>
   If you don't, go to step 4. <br>
   `Brightics Studio Updater.exe` 파일이 존재하면 삭제해주시고 없다면 다음 단계로 넘어가 주세요.
   
4. If you find `msvcp140_3.dll` file, delete this file. <br>
   If you don't, go to step 5. <br>
   `msvcp140_3.dll` 파일이 존재하면 삭제해주시고 없다면 다음 단계로 넘어가 주세요.
![4](img/4_e.png)

5. Open File Explorer and type `%temp%` in the address bar. <br>
   파일 탐색기를 열고 주소 표시창에 `%temp%` 를 입력해주세요.
![5](img/5_e.png)

6. If you find `STL.vbs` file, delete this file. <br>
   `STL.vbs` 파일이 존재하면 삭제해주시고 없다면 다음 단계로 넘어가 주세요. <br>
   If you don't, go to step 7 
![6](img/6_e.png)

7. Open Window Run window. (Press `Window Key + R`)  <br>
   Then type `cmd`   <br>
   윈도키 + R 단축키를 이용하거나 윈도 실행창에서 `cmd` 를 입력해주세요.  <br>
![7](img/7_e.png)

8. When Command Prompt is open, type `SchTasks /DELETE /TN BrighticsStudioUpdater`   <br>
   윈도우 명령어 창이 열리면 `SchTasks /DELETE /TN BrighticsStudioUpdater` 를 입력해주세요.
![8](img/8_e.png)

### [How to reinstall Brightics Studio]
Please, download and reinstall Brightics Studio using the download link beflow.  <br>
아래 링크를 다운로드하여 재설치하시기 바랍니다. <br>
[BrighticsStudio-v1.1-2020.09.24.1600933488-windows.exe](https://github.com/brightics/studio/releases/download/v1.1-2020.09.24/BrighticsStudio-v1.1-2020.09.24.1600933488-windows.exe)

If you have any inconvenience or further questions, please contact us  brightics@samsung.com . <br>
사용에 불편을 끼쳐 죄송합니다. 궁금한점이 있으면 brightics@samsung.com 로 연락주세요.
