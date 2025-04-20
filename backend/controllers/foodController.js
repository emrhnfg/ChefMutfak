import foodModel from "../models/foodModel.js";
import fs from "fs";

// Yiyecek ekleme
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Yiyecek Eklendi" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Tüm yiyecek listesi
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Yiyecek silme
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Yiyecek Silindi" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

// Yiyecek Arama
const searchFood = async (req, res) => {
    try {
        const searchTerm = req.query.term || "";
        const foods = await foodModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } }
            ]
        });

        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Arama yapılırken hata oluştu" });
    }
};

// Yiyecek detaylarını getirme
const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id); // foodId'ye göre yiyeceği bul
        if (!food) {
            return res.status(404).json({ success: false, message: "Yiyecek bulunamadı" });
        }
        res.json({ success: true, data: food }); // Yiyecek detaylarını dön
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Hata" });
    }
};

// ✅ Export işlemi
export { addFood, listFood, removeFood, searchFood, getFoodById };