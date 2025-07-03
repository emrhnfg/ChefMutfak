import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Kullanıcı siparişi oluşturma (frontend için)
const placeOrder = async (req, res) => {
    // FRONTEND URL'sini ortam değişkeninden al
    const frontend_url = process.env.FRONTEND_URL; 

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "try", 
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "usd", // Eğer TRY kullanıyorsanız "try" olarak güncelleyin
                product_data: { name: "Teslimat Ücreti" },
                unit_amount: 2 * 100 // Teslimat ücreti 2 USD olarak ayarlandı
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            // success_url ve cancel_url'yi dinamik olarak frontend_url'den alıyoruz
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Sipariş doğrulama
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Ödeme Yapıldı" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Ödeme Yapılmadı" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Kullanıcı Siparişleri
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Admin - Tüm Siparişleri Görüntüleme
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Siparişler alınamadı" });
    }
};

// Admin - Sipariş Durumu Güncelleme
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ success: true, message: "Durum güncellendi", data: updatedOrder });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Durum güncellenemedi" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({})
            .select('-password') // Şifreleri gizle
            .sort({ createdAt: -1 }); // En yeni kullanıcılar önce

        // Her kullanıcı için sipariş sayısını hesapla
        const usersWithOrderCount = await Promise.all(
            users.map(async (user) => {
                const orderCount = await orderModel.countDocuments({ userId: user._id });
                const totalSpent = await orderModel.aggregate([
                    { $match: { userId: user._id.toString(), payment: true } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);
                
                return {
                    ...user.toObject(),
                    orderCount,
                    totalSpent: totalSpent[0]?.total || 0
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
        res.json({ success: false, message: "Kullanıcılar alınamadı" });
    }
};


export {
    placeOrder,
    verifyOrder,
    userOrders,
    getAllOrders,
    updateOrderStatus,
    getAllUsers
    
};