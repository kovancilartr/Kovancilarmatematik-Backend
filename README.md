# LearnApp Backend API

Bu proje, uzaktan eğitim platformu için geliştirilmiş kapsamlı bir Backend API projesidir. Node.js ve Express.js kullanılarak yazılmış olup, veritabanı yönetimi için Prisma ORM ve PostgreSQL kullanmaktadır. Modern güvenlik önlemleri (JWT, Role-Based Access Control) ve performans optimizasyonları içermektedir.

## 🚀 Teknolojiler

Proje aşağıdaki teknolojiler kullanılarak geliştirilmiştir:

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Dil**: [TypeScript](https://www.typescriptlang.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **ORM (Veritabanı)**: [Prisma](https://www.prisma.io/)
-   **Veritabanı**: PostgreSQL
-   **Authentication**: JWT (JSON Web Token)
-   **Güvenlik**: Bcrypt (Parola şifreleme), Helmet (HTTP başlık güvenliği), CORS
-   **Validasyon**: Zod
-   **Dosya Yükleme**: Multer ve AWS SDK (S3 / R2 uyumlu depolama için)

## 🛠 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler

-   Node.js (v18 veya üzeri)
-   PostgreSQL veritabanı

### 2. Bağımlılıkları Yükleme

Proje klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd backend
npm install
```

### 3. Çevresel Değişkenler (.env)

Kök dizinde `.env` dosyasını oluşturun ve gerekli ayarları yapılandırın:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/veritabani_adi?schema=public"

# Auth (JWT)
JWT_SECRET="cok_gizli_super_gizli_anahtar"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="baska_bir_gizli_anahtar"
REFRESH_TOKEN_EXPIRES_IN="7d"

# AWS / Cloud Storage (Dosya Yükleme İçin)
AWS_ACCESS_KEY_ID="xxx"
AWS_SECRET_ACCESS_KEY="xxx"
AWS_REGION="auto"
AWS_BUCKET_NAME="bucket-adi"
AWS_ENDPOINT="https://s3.amazonaws.com"
```

### 4. Veritabanını Hazırlama

Prisma şemasını veritabanına uygulayın:

```bash
# Migration oluştur ve uygula
npm run db:migrate

# Seed verilerini yükle (Admin kullanıcısı vb. oluşturur)
npm run db:seed
```

### 5. Sunucuyu Başlatma

Geliştirme modunda (değişiklikleri anlık izler):
```bash
npm run dev
```

Prodüksiyon modunda:
```bash
npm run build
npm start
```

---

## 📚 API Dokümantasyonu

API temel URL'si: `http://localhost:3000/api`

Tüm endpoint'ler standart JSON yanıt yapısını kullanır:
```json
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}
```
Hata durumunda:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Hata açıklaması"
  }
}
```

### 🔑 Kimlik Doğrulama (Auth)

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Herkes | Giriş yap ve Access Token al. |
| `POST` | `/auth/refresh` | Herkes | Yenileme tokenı ile yeni Access Token al. |
| `POST` | `/auth/logout` | Herkes | Çıkış yap (Refresh token'ı geçersiz kıl). |
| `GET` | `/auth/me` | Giriş Yapmış | Profil bilgilerini getir. |
| `POST` | `/auth/register` | **Sadece Admin** | Yeni kullanıcı (Öğrenci/Öğretmen/Admin) oluştur. |

### 📂 Kategoriler (Categories) - Kurslar

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Herkes | Tüm kurs kategorilerini listeler. (Admin hepsini, Misafir sadece herkese açık olanları görür). |
| `GET` | `/categories/:id` | Herkes | Belirli bir kursun detaylarını getirir. (Gizli ise ve yetki yoksa 403 döner). |
| `POST` | `/categories` | **Sadece Admin** | Yeni kategori/kurs oluştur. |
| `PUT` | `/categories/:id` | **Sadece Admin** | Kategoriyi güncelle (İsim, Yayın Durumu, Erişim). |
| `DELETE` | `/categories/:id` | **Sadece Admin** | Kategoriyi sil. |

### 📖 Konular (Subjects)

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `GET` | `/subjects` | Herkes | Konuları listeler. `categoryId` query parametresi ile filtreleme yapılabilir. |
| `POST` | `/subjects` | **Admin/Öğrt.** | Yeni konu ekle. |

### 🎥 Dersler (Lessons) - Videolar

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `GET` | `/lessons` | Herkes | Dersleri listeler. |
| `POST` | `/lessons` | **Admin/Öğrt.** | Yeni video ders ekle. |

### 📝 Sorular ve Testler (Questions & Tests)

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `POST` | `/questions` | **Admin/Öğrt.** | Yeni soru ekle (Görsel, şıklar, doğru cevap). |
| `GET` | `/tests` | **Admin/Öğrt.** | Tüm testleri listele. |
| `POST` | `/tests` | **Admin/Öğrt.** | Yeni test oluştur ve soruları bağla. |
| `POST` | `/test-assignments`| **Admin/Öğrt.** | Bir testi öğrenciye ata. |
| `GET` | `/test-assignments/my-tests` | **Öğrenci** | Kendisine atanmış testleri gör. |

### 👥 Kullanıcı Yönetimi (Users)

| Metot | Endpoint | Yetki | Açıklama |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | **Sadece Admin** | Sistemdeki tüm kullanıcıları listele. |
| `POST` | `/users` | **Sadece Admin** | Manuel kullanıcı oluştur. |
| `PUT` | `/users/:id` | **Sadece Admin** | Kullanıcı bilgilerini güncelle (Şifre sıfırlama vb.). |
| `DELETE` | `/users/:id` | **Sadece Admin** | Kullanıcıyı sil. |

## 🏗 Veri Modeli

Proje ilişkisel bir veri modeli üzerine kuruludur:

-   **Category**: Ana kurs başlıkları (Matematik, Geometri vb.).
-   **Subject**: Kurs alt konuları.
-   **Lesson**: Video ders içerikleri.
-   **User**: Öğrenci, Öğretmen ve Yöneticiler.
-   **Test System**: Learning Objectives (Kazanımlar) -> Questions (Sorular) -> Tests (Testler) -> Assignments (Atamalar) zincirini takip eder.

## 🔒 Güvenlik Notları

-   Tüm "yazma" işlemleri (POST, PUT, DELETE) varsayılan olarak yetkilendirme (Token) gerektirir.
-   Hassas veriler (Şifreler) veritabanında asla düz metin olarak saklanmaz, hashlenir.
-   CORS politikaları ile sadece izin verilen frontend uygulamalarının API'ye erişmesi sağlanır.

---
**Geliştirici:** Kovancılar Matematik Yazılım Ekibi
**Tarih:** 2026