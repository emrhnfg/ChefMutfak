import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

// Stripe API anahtarını ortam değişkenlerinden al
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Kullanıcı siparişi oluşturma (frontend'den gelen istek)
const placeOrder = async (req, res) => {
    // FRONTEND URL'sini ortam değişkeninden alıyoruz.
    // Bu, Stripe'ın ödeme sonrası kullanıcıyı doğru canlı siteye yönlendirmesini sağlar.
    const frontend_url = process.env.FRONTEND_URL;

    try {
        // Yeni sipariş modelini oluştur
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount, // Frontend'den gelen toplam tutar
            address: req.body.address
        });

        // Siparişi veritabanına kaydet
        await newOrder.save();
        // Kullanıcının sepetini temizle (sipariş verildiği için)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Stripe Checkout Session için ürün kalemlerini hazırla
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "try", // Ürünler için para birimi: Türk Lirası
                product_data: { name: item.name },
                unit_amount: item.price * 100 // Fiyatı kuruşa çevir (Stripe 100 birim = 1 para birimi bekler)
            },
            quantity: item.quantity
        }));

        // Teslimat Ücretini ürün kalemlerine ekle
        line_items.push({
            price_data: {
                currency: "try", // Teslimat ücreti için para birimi: Türk Lirası (Ürünlerle tutarlı olmalı)
                product_data: { name: "Teslimat Ücreti" },
                unit_amount: 10 * 100 // Teslimat ücreti 10 TL olarak ayarlandı (10 * 100 kuruş)
            },
            quantity: 1
        });

        // Stripe Checkout Session oluştur
        const session = await stripe.checkout.sessions.create({
            line_items: line_items, // Hazırlanan ürün kalemleri
            mode: 'payment', // Ödeme modu
            // Başarılı ödeme sonrası yönlendirilecek URL
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            // İptal edilen ödeme sonrası yönlendirilecek URL
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Frontend'e Stripe session URL'sini gönder
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        // Hata durumunda konsola logla ve frontend'e hata mesajı gönder
        console.log(error);
        res.json({ success: false, message: "Sipariş oluşturulurken hata oluştu." });
    }
};

// Sipariş doğrulama (Stripe'dan geri yönlendirme sonrası)
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            // Ödeme başarılıysa siparişin ödeme durumunu true yap
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Ödeme Başarılı" });
        } else {
            // Ödeme başarısızsa siparişi veritabanından sil
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Ödeme İptal Edildi" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Sipariş doğrulama sırasında hata oluştu." });
    }
};

// Kullanıcıya ait siparişleri listeleme
const userOrders = async (req, res) => {
    try {
        // Belirli bir kullanıcıya ait siparişleri bul
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Kullanıcı siparişleri alınamadı." });
    }
};

// Admin paneli için tüm siparişleri listeleme
const getAllOrders = async (req, res) => {
    try {
        // Tüm siparişleri oluşturulma tarihine göre tersten sırala (en yeniler başta)
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Siparişler alınamadı." });
    }
};

// Admin paneli için sipariş durumunu güncelleme
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // URL parametresinden sipariş ID'sini al
    const { status } = req.body; // İstek gövdesinden yeni durumu al

    try {
        // Siparişi ID'ye göre bul ve durumunu güncelle
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ success: true, message: "Sipariş durumu başarıyla güncellendi.", data: updatedOrder });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Sipariş durumu güncellenemedi." });
    }
};

// Admin paneli için tüm kullanıcıları listeleme
const getAllUsers = async (req, res) => {
    try {
        // Tüm kullanıcıları şifreleri hariç seç ve oluşturulma tarihine göre sırala
        const users = await userModel.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        // Her kullanıcı için sipariş sayısını ve toplam harcamayı hesapla
        const usersWithOrderCount = await Promise.all(
            users.map(async (user) => {
                const orderCount = await orderModel.countDocuments({ userId: user._id });
                const totalSpent = await orderModel.aggregate([
                    { $match: { userId: user._id.toString(), payment: true } }, // Sadece başarılı ödemeleri dahil et
                    { $group: { _id: null, total: { $sum: "$amount" } } } // Toplam tutarı hesapla
                ]);

                return {
                    ...user.toObject(), // Kullanıcı objesinin kopyasını al
                    orderCount, // Hesaplanan sipariş sayısı
                    totalSpent: totalSpent[0]?.total || 0 // Hesaplanan toplam harcama (yoksa 0)
                };
            })
        );

        res.json({
            success: true,
            data: usersWithOrderCount,
            totalUsers: users.length
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Kullanıcılar alınamadı." });
    }
};

// Fonksiyonları dışa aktar
export {
    placeOrder,
    verifyOrder,
    userOrders,
    getAllOrders,
    updateOrderStatus,
    getAllUsers
};