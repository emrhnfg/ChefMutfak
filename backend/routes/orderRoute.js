import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/adminorders", getAllOrders);
orderRouter.put("/updatestatus/:orderId", updateOrderStatus);

export default orderRouter;
