# Back-End Dokümantasyonu

Domain Adresi: domainadresi.com

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
| Yöntem | URL                  | Açıklama                          |
|--------|----------------------|----------------------------------|
| POST   | /api/user/register    | Kullanıcı kaydı                  |
| POST   | /api/user/login       | Kullanıcı girişi                 |
| GET    | /api/user/profile     | Profil bilgisi                   |
| PUT    | /api/user/profile     | Profil güncelleme                |
| POST   | /api/order/place      | Sipariş oluşturma                |
| GET    | /api/order/userorders | Kullanıcının siparişlerini getir|
| GET    | /api/order/adminall   | Tüm siparişleri listele (admin) |
| PUT    | /api/order/status/:id | Sipariş durumu güncelle          |
