
::�ϲ��ļ�
for /f %%i in (OpenCharts.txt) do type %%i >> OpenChart-debug.js
for /f %%i in (OpenCharts2.txt) do type %%i >> OpenChart-debug2.js

:: ����ѹ��
java -jar ../tools/compressor/yuicompressor-2.4.2.jar --type js --charset utf-8 -o ../tools/compressor/OpenChart.js OpenChart-debug.js 
java -jar ../tools/compressor/yuicompressor-2.4.2.jar --type js --charset utf-8 -o ../tools/compressor/OpenChart2.js OpenChart-debug2.js 
 
::ɾ���ϲ�����ļ�
del OpenChart-debug.js /f /q
del OpenChart-debug2.js /f /q

::ɾ��Դ���е��ļ�
del "..\OpenCharts-min.js" /f /q

::���л�������
CScript /nologo ../tools/compressor/pack.wsf ../tools/compressor/OpenChart.js >> ../tools/compressor/OpenChart_compress.js
CScript /nologo ../tools/compressor/pack.wsf ../tools/compressor/OpenChart2.js >> ../tools/compressor/OpenChart_compress2.js

cd /d ../tools/compressor
for /f %%i in (compress.txt) do type %%i >> ../../OpenCharts-min.js

::ɾ��ѹ������ļ�
del OpenChart.js
del OpenChart2.js
del OpenChart_compress.js
del OpenChart_compress2.js

::ת����ʽΪUTF-8
dir "..\..\OpenCharts-min.js" /A-D /B /S > encode.log
for /f %%i in (encode.log) do (  
    CScript /nologo encode.vbs %%i utf-8  
)
del encode.log



