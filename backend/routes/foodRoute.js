import express from "express";
import { addFood, listFood, removeFood, searchFood, getFoodById } from "../controllers/foodController.js"; 
import multer from "multer";

const foodRouter = express.Router();

// 📌 Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// 📌 API Route'ları
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/search", searchFood); // 🆕 Arama route'u
foodRouter.get("/:id", getFoodById); // 🆕 Yiyecek detay route'u 

export default foodRouter;