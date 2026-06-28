#!/bin/bash

echo "🚀 CloudSeer Kurulum ve Başlatma Sihirbazına Hoş Geldiniz!"
echo "=========================================================="

cd frontend/web || exit

echo "📦 Gerekli paketler yükleniyor... Lütfen bekleyin."
npm install

echo ""
echo "🏗️ Proje (Production) ortamında derleniyor..."
npm run build

echo ""
echo "🔥 CloudSeer başlıyor!"
echo "👉 Tarayıcınızda http://localhost:3000 adresini açabilirsiniz."
echo "Durdurmak için CTRL+C tuşlarına basabilirsiniz."

npm start
