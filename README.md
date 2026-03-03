# BulutKâhini

**Proje Türü:** Lisans Bitirme Projesi / Araştırma Projesi  

---

## 1. Özet (Abstract)
Günümüzde mikroservis mimarilerinin ve Kubernetes tabanlı konteyner orkestrasyonunun yaygınlaşması, sistemlerin ölçeklenebilirliğini artırırken bulut maliyetlerinin karmaşıklaşmasına (Cloud Cost Sprawl) neden olmuştur. Şirketler, iş yüklerini garantiye almak adına genellikle "over-provisioning" (gereğinden fazla kaynak tahsisi) yapmakta ve bu durum %40-60 oranında kaynak israfına yol açmaktadır. 

Bu bitirme projesi kapsamında geliştirilen **BulutKâhini**, salt geçmiş maliyetleri raporlayan mevcut (reaktif) sistemlerin aksine; **Makine Öğrenimi (LSTM & Prophet)** tabanlı zaman serisi tahmini, **Dijital İkiz (Digital Twin)** destekli simülasyon ve **Otonom Karar Ajanları (KâhinAgent)** kullanarak bulut harcamalarını proaktif (tahminsel) olarak optimize etmeyi hedefleyen bir "Predictive FinOps" platformudur.

---

## 2. Problemin Tanımı: Neden Böyle Bir Sisteme İhtiyaç Var?

### 2.1. Dinamik İş Yükleri ve Statik Konfigürasyon Çıkmazı
Kubernetes üzerinde çalışan pod'ların CPU ve RAM gereksinimleri gün içindeki trafiğe göre dinamik olarak değişir. Ancak geliştiriciler `requests` ve `limits` değerlerini genellikle statik olarak en yoğun yük anına (peak time) göre belirler. Bu "bin-packing" problemindeki verimsizlik, sunucu (node) havuzlarının boş yere meşgul edilmesine neden olur.

### 2.2. Literatürdeki Mevcut Çözümlerin Sınırları
- **Kubecost / OpenCost:** Mevcut harcamaları namespace veya pod bazlı etiketleyip harika bir görünürlük (visibility) sunarlar. Ancak sadece **geçmişe ve şu ana** bakarlar. "Yarın ne kadar harcayacağız?" veya "Bunu nasıl düşürürüz?" sorularını geliştiriciye bırakırlar.
- **Karpenter / Cluster Autoscaler:** Node ölçekleme işlemlerini yaparlar, ancak uygulama katmanındaki (Pod) israfı (yanlış yazılmış request'leri) optimize edemezler.
- **Eksik Olan Nokta:** Karar almadan önce "Ya şöyle olursa?" sorusunu güvenli bir ortamda test edebilecek bir simülasyon (What-if) motorunun eksikliğidir.

---

## 3. BulutKâhini'nin Çözüm Metodolojisi

Mühendislik perspektifinden projede üç ana yenilikçi katman tasarlanmıştır:

### 3.1. Dijital İkiz Motoru (Digital Twin Engine)
Gerçek bir production cluster'ı üzerinde deneme-yanılma yapmak kesinti (downtime) riskleri taşır. Projemizdeki Go tabanlı `digital-twin` servisi, mevcut K8s cluster'ının bellek içi (in-memory) bir matematiksel kopyasını oluşturur. 
Örneğin; *"Tüm worker node'ları Spot Instance'a çevirirsem riskim ne olur, ne kadar tasarruf ederim?"* sorgusu, gerçek sisteme dokunulmadan bu kopya üzerinde hesaplanır.

### 3.2. Zaman Serisi Tahmin Modelleri (Predictive ML)
Tarihsel donanım kullanım ve fatura verileri (Prometheus metric'leri üzerinden toplanan) Python tabanlı `forecast-engine` servisine aktarılır.
- **Kısa/Orta Vade Tahmini:** Prophet algoritması (sezonsallık ve haftanın günleri etkisi).
- **Anomali ve Eğilim Tespiti:** Derin Öğrenme tabanlı **LSTM** (Long Short-Term Memory) ağları ile kaynak kullanımlarındaki ani sıçramaların tespiti.

### 3.3. KâhinAgent Karar Katmanı
Scale/Rightsizing işlemlerini otomatik yapabilmek için tasarlanan ajandır. Spot node kesilme olasılığını (Spot Interruption Risk) hesaplar ve risk skoru bir eşik değerinin altındaysa, `action-executor` mikroservisi aracılığıyla Kubernetes API'sine yama (Patch) göndererek otonom optimizasyon sağlar.

---

## 4. Sistem Mimarisi ve Teknoloji Yığını

Sistem, dağıtık bir mikroservis mimarisi (Microservices Architecture) ile tasarlanmıştır.

- **Backend (Core Services):** `Go 1.22+` (Yüksek eşzamanlılık ve düşük bellek tüketimi, K8s native ekosistemi ile tam uyum).
- **Yapay Zeka / ML Katmanı:** `Python 3.9+` (PyTorch, Prophet, Pandas).
- **Frontend / Arayüz:** `Next.js 14`, React, TailwindCSS (Kullanıcı deneyimi ve dashboard grafik gösterimleri).
- **Veritabanı / Cache:** PostgreSQL (İlişkisel veriler) + TimescaleDB (Zaman serisi metrikleri) ve Redis (Dijital ikiz önbelleği).
- **İletişim Protokolü:** Mikroservisler arası asenkron olay güdümlü mimari için `NATS JetStream`, API dışa açılımı için RESTful API (Go Gin/Mux router).

---

## 5. Dizin Yapısı (Monorepo)

```text
cloudseer/
├── services/
│   ├── agent-core/        # Otonom optimizasyon ve risk hesaplama ajanı
│   ├── api-gateway/       # Dış dünya ile iletişim, routing
│   ├── cost-engine/       # Metriklerden fiyatlandırma çıkaran motor
│   ├── data-collector/    # K8s ve Prometheus üzerinden veri çekimi
│   ├── digital-twin/      # K8s state simülasyon modeli
│   ├── forecast-engine/   # LSTM & Prophet ML modelleri (Python)
│   ├── action-executor/   # Onaylanan işlemleri K8s API'ye iletme
│   ├── notification/      # E-posta/Slack entegrasyonu
│   └── ui-backend/        # Next.js için Backend-for-Frontend (BFF)
├── frontend/web/          # Kullanıcı Arayüzü (Next.js Dashboard)
├── infrastructure/        # Terraform, Helm Chart ve ArgoCD manifestoları
├── migrations/            # Veritabanı SQL şemaları
└── docs/                  # API, Mimari diyagramlar ve Akademik taslaklar
```

---

## 6. Kurulum ve Çalıştırma (PoC)

Bu proje geliştirme aşamasındadır. Lokal bilgisayarda mikroservisleri derlemek ve ayağa kaldırmak için:

1. **Bağımlılıkları İndirin:** Tüm `services/*/` dizinlerinde `go mod tidy` ve Python klasöründe `pip install -r requirements.txt` komutlarını çalıştırın.
2. **Servisleri Başlatın:** (Gelecekte Docker Compose entegrasyonu aktif edilecektir). Lokal geliştirme için:
   ```bash
   cd services/api-gateway
   go run cmd/main.go
   ```
3. **Arayüzü Başlatın:**
   ```bash
   cd frontend/web
   npm install
   npm run dev
   ```

---

## 7. Sonuç ve Katkılar

Bu proje ile hedeflenen akademik ve sektörel çıktılar şunlardır:
1. FinOps kültürünün salt finansal bir raporlamadan çıkarılıp, mühendislik katmanında (CI/CD ve Deployment esnasında) çözülmesi.
2. Siyah-kutu otonom sistemlere duyulan güvensizliğin, "Dijital İkiz" simülasyonları ve "Risk Skorlama" algoritmaları ile aşılması.

