@echo off
echo CloudSeer Kurulum ve Baslatma Sihirbazina Hos Geldiniz!
echo ========================================================
echo Gerekli paketler yukleniyor... Lutfen bekleyin.
cd frontend\web
call npm install
echo.
echo Proje (Production) ortaminda derleniyor...
call npm run build
echo.
echo CloudSeer basliyor... Tarayicinizda http://localhost:3000 adresini acabilirsiniz.
call npm start
pause
