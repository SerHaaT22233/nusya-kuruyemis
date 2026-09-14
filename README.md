# Nusya Kuruyemiş - E-Ticaret Sistemi

Modern, profesyonel ve veritabanı bağlantılı bir e-ticaret web sitesi.

## Teknolojiler

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / SQLite
- JWT Authentication
- bcrypt

## Proje Yapısı

```
nusya-kuruyemis/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # Veritabanı yapılandırması
│   │   ├── controllers/    # API kontrolleri
│   │   ├── middleware/     # Auth, upload middleware
│   │   ├── routes/         # API endpoint'leri
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── index.ts        # Sunucu girişi
│   ├── prisma/
│   │   ├── schema.prisma   # Veritabanı şeması
│   │   └── seed.ts         # Örnek veriler
│   ├── uploads/            # Yüklenen dosyalar
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/               # Next.js uygulaması
│   ├── src/
│   │   ├── app/           # Next.js App Router sayfaları
│   │   ├── components/    # UI bileşenleri
│   │   ├── contexts/      # React Context (Auth, Cart)
│   │   ├── lib/          # API istemcisi
│   │   └── types/        # TypeScript tipleri
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local
├── package.json
└── tsconfig.json
```

## Kurulum Adımları

### Ön Gereksinimler
- Node.js 18+
- npm veya yarn

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarla
Backend için `backend/.env` dosyası zaten oluşturulmuştur.
Frontend için `frontend/.env.local` dosyası zaten oluşturulmuştur.

### 3. Veritabanını Hazırla
```bash
cd backend
npm run db:push
npm run db:seed
```

### 4. Uygulamayı Başlat
```bash
# Her iki servisi aynı anda başlat
npm run dev
```

Veya ayrı ayrı:
```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev
```

## Varsayılan Kullanıcılar

### Admin
- E-posta: `admin@nusya.com`
- Şifre: `admin123`

## API Endpoint'leri

### Auth
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Kullanıcı bilgileri
- `PUT /api/auth/profile` - Profil güncelle
- `PUT /api/auth/change-password` - Şifre değiştir

### Products
- `GET /api/products` - Tüm ürünler
- `GET /api/products/:slug` - Ürün detayı
- `GET /api/products/featured` - Öne çıkan ürünler
- `GET /api/products/new` - Yeni ürünler
- `GET /api/products/top-selling` - En çok satanlar

### Categories
- `GET /api/categories` - Tüm kategoriler
- `POST /api/categories` - Kategori ekle (Admin)
- `PUT /api/categories/:id` - Kategori düzenle (Admin)
- `DELETE /api/categories/:id` - Kategori sil (Admin)

### Cart
- `GET /api/cart` - Sepeti görüntüle
- `POST /api/cart` - Sepete ekle
- `PUT /api/cart/:itemId` - Sepet güncelle
- `DELETE /api/cart/:itemId` - Sepetten çıkar
- `DELETE /api/cart` - Sepeti temizle

### Orders
- `POST /api/orders` - Sipariş oluştur
- `GET /api/orders` - Siparişlerim
- `GET /api/orders/:id` - Sipariş detayı
- `GET /api/orders/addresses` - Adreslerim
- `POST /api/orders/addresses` - Adres ekle
- `DELETE /api/orders/addresses/:id` - Adres sil
- `GET /api/orders/favorites` - Favoriler
- `POST /api/orders/favorites` - Favorilere ekle
- `DELETE /api/orders/favorites/:id` - Favoriden çıkar

### Admin
- `GET /api/admin/dashboard` - Dashboard istatistikleri
- `GET /api/admin/orders` - Tüm siparişler
- `PUT /api/admin/orders/:id` - Sipariş durumu güncelle
- `GET /api/admin/users` - Tüm kullanıcılar
- `POST /api/admin/upload` - Resim yükle

## Veritabanı Modelleri

- Users - Kullanıcılar
- Categories - Kategoriler
- Products - Ürünler
- ProductImages - Ürün görselleri
- ProductVariants - Ürün varyantları (gramaj seçenekleri)
- Cart - Sepetler
- CartItems - Sepet öğeleri
- Orders - Siparişler
- OrderItems - Sipariş öğeleri
- Addresses - Adresler
- Favorites - Favoriler
- Coupons - Kuponlar

## Lisans

MIT