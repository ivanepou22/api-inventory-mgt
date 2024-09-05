import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "@/controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/orders", createOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/:id", getOrder);
orderRouter.put("/orders/:id", updateOrder);
orderRouter.delete("/orders/:id", deleteOrder);

export default orderRouter;
