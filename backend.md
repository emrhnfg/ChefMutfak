# Back-End Dokümantasyonu

Domain Adresi: https://chefmutfak.netlify.app/

Docker: Kullanılmadı.

REST API: Kullanıldı.

Redis:Kullanılmadı.

RabbitMQ: Kullanılmadı.

CI/CD: Kullanılmadı.

## Kullanılan Teknolojiler
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- Stripe (Ödeme Entegrasyonu)

## API Endpointleri

| Yöntem | URL                         | Açıklama                          |
|--------|------------------------------|----------------------------------|
| POST   | /api/user/register           | Kullanıcı kaydı                  |
| POST   | /api/user/login              | Kullanıcı girişi                 |
| GET    | /api/user/profile            | Profil bilgisi                   |
| PUT    | /api/user/profile            | Profil güncelleme                |
| GET    | /api/user/admin/all          | Tüm kullanıcıları listele (admin)|
| POST   | /api/cart/add                | Sepete ürün ekle                 |
| POST   | /api/cart/remove             | Sepetten ürün çıkar              |
| POST   | /api/cart/get                | Sepeti getir                     |
| POST   | /api/food/add                | Yeni yemek ekle (admin)          |
| GET    | /api/food/list               | Tüm yemekleri listele            |
| POST   | /api/food/remove             | Yemeği sil (admin)               |
| GET    | /api/food/search             | Yemek ara                        |
| GET    | /api/food/categories         | Kategori listesini getir         |
| GET    | /api/food/:id                | Belirli yemeği getir (ID ile)    |
| PUT    | /api/food/:id                | Yemeği güncelle (admin)          |
| POST   | /api/order/place             | Sipariş oluşturma                |
| POST   | /api/order/verify            | Ödeme doğrulama                  |
| POST   | /api/order/userorders        | Kullanıcının siparişlerini getir|
| GET    | /api/order/adminorders       | Tüm siparişleri listele (admin) |
| PUT    | /api/order/updatestatus/:id  | Sipariş durumu güncelle          |
