import foodModel from "../models/foodModel.js";
import fs from "fs";

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

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hata" });
    }
};

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

const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Yiyecek bulunamadı" });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Hata" });
    }
};

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        const updateFields = {};
        if (name !== undefined) {
            updateFields.name = name;
        }
        if (description !== undefined) {
            updateFields.description = description;
        }
        if (price !== undefined) {
            updateFields.price = price;
        }
        if (category !== undefined) {
            updateFields.category = category;
        }

        if (req.file) {
            const oldFood = await foodModel.findById(id);
            if (oldFood && oldFood.image && fs.existsSync(`uploads/${oldFood.image}`)) {
                fs.unlink(`uploads/${oldFood.image}`, (err) => {
                    if (err) console.error("Eski resim silinirken hata oluştu:", err);
                });
            }
            updateFields.image = req.file.filename;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: "Güncellenecek veri bulunamadı." });
        }

        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: "Yiyecek bulunamadı." });
        }

        res.json({ success: true, message: "Yiyecek başarıyla güncellendi", data: updatedFood });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Yiyecek güncellenirken hata oluştu." });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await foodModel.distinct('category');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Kategoriler alınırken hata oluştu." });
    }
};

export { addFood, listFood, removeFood, searchFood, getFoodById, updateFood, listCategories };