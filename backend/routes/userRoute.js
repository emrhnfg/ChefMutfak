import express from "express"
import { loginUser, registerUser, getProfile, updateProfile, getAllUsers  } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

// Auth gerektirmeyen route'lar
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/admin/all", getAllUsers);

// Auth gerektiren route'lar (profil işlemleri)
userRouter.get("/profile", authMiddleware, getProfile)
userRouter.put("/profile", authMiddleware, updateProfile)


export default userRouter;