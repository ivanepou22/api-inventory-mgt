import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getShopSales,
  getShopsSales,
  updateOrder,
} from "@/controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/orders", createOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/:id", getOrder);
orderRouter.put("/orders/:id", updateOrder);
orderRouter.delete("/orders/:id", deleteOrder);
orderRouter.get("/orders/sales/shops/:shopId", getShopSales);
orderRouter.get("/orders/sales/shops", getShopsSales);

export default orderRouter;
