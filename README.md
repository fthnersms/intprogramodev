# DYENT - Diş Hekimliği Randevu Sistemi

## 📋 Proje Hakkında

DYENT, modern diş hekimliği hizmetleri için geliştirilmiş kapsamlı bir web tabanlı randevu ve hasta yönetim sistemidir. Dr. Dilruba Yiğit'in kliniği için özel olarak tasarlanmış bu sistem, hastaların kolayca randevu alabilmesini ve doktorlarla iletişim kurabilmesini sağlar.

## 🚀 Özellikler

### 👥 Kullanıcı Rolleri
- **Hasta (USER)**: Randevu oluşturma, mesajlaşma ve randevu geçmişini görüntüleme
- **Doktor (DOCTOR)**: Hasta mesajlarını yönetme, randevuları görüntüleme
- **Yönetici (ADMIN)**: Tüm sistem yönetimi, kullanıcı ve randevu kontrolü

### 📅 Randevu Sistemi
- Online randevu oluşturma
- Randevu durumu takibi (Beklemede, Onaylandı, Tamamlandı)
- Tarih ve saat seçimi
- Hizmet seçimi
- Randevu notları ekleme

### 💬 Mesajlaşma Sistemi
- Hasta-Doktor arası güvenli iletişim
- Gerçek zamanlı mesaj bildirimleri
- Mesaj okundu durumu

### 🏥 Sunulan Hizmetler
- Genel Muayene
- Diş Temizliği
- Dolgu
- Kanal Tedavisi
- Diş Çekimi
- Diş Beyazlatma
- İmplant Konsültasyonu
- Estetik Diş Hekimliği
- Çocuk Diş Hekimliği

## 🛠️ Teknik Altyapı

### Kullanılan Teknolojiler
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Veritabanı**: SQLite (Prisma ORM)
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)

### Sistem Gereksinimleri
- Node.js 18.0 veya üzeri
- npm veya yarn paket yöneticisi

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd dishekim
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Veritabanını oluşturun:
```bash
npx prisma migrate dev
```

4. Örnek verileri yükleyin:
```bash
npm run seed
# veya
yarn seed
```

5. Uygulamayı başlatın:
```bash
npm run dev
# veya
yarn dev
```

## 👤 Demo Hesapları

- **Admin/Doktor Hesabı**:
  - E-posta: admin@dyent.com
  - Şifre: admin123


## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifreli parola saklama (bcrypt)
- Role dayalı erişim kontrolü
- HTTPS üzerinden güvenli iletişim

