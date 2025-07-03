import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import orderModel from '../models/orderModel.js';

// Kullanıcı Girişi
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Kullanıcı Bulunamadı" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Geçersiz Kimlik Bilgileri" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Kullanıcı Kaydı
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Kullanıcı zaten var mı diye kontrol et
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Kullanıcı Zaten Var" });
        }

        // E-posta formatını ve güçlü şifreyi doğrulama
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Lütfen geçerli bir e-posta girin" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Lütfen güçlü bir şifre girin" });
        }

        // Şifreyi şifreleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
}

// Profil Bilgilerini Getir
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "Kullanıcı Bulunamadı" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
}

// Profil Güncelle (sadece isim ve e-posta)
const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.json({ success: false, message: "Kullanıcı Bulunamadı" });
        }

        // E-posta değişiyorsa kontrol et
        if (email && email !== user.email) {
            const emailExists = await userModel.findOne({ email });
            if (emailExists) {
                return res.json({ success: false, message: "Bu e-posta zaten kullanımda" });
            }
            
            if (!validator.isEmail(email)) {
                return res.json({ success: false, message: "Lütfen geçerli bir e-posta girin" });
            }
        }

        // Güncellenecek veriler
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.body.userId,
            updateData,
            { new: true }
        ).select("-password");

        res.json({ success: true, message: "Profil başarıyla güncellendi", user: updatedUser });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
}

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

export { loginUser, registerUser, getProfile, updateProfile, getAllUsers };