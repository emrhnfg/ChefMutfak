import express from "express";
import { addFood, listFood, removeFood, searchFood, getFoodById, updateFood, listCategories } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/search", searchFood);
foodRouter.get("/categories", listCategories); 
foodRouter.get("/:id", getFoodById);
foodRouter.put("/:id", upload.single("image"), updateFood);


export default foodRouter;