import express from "express";
import {
  createPurchase,
  getPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
} from "@/controllers/purchaseController";

const purchaseRouter = express.Router();

purchaseRouter.post("/purchases", createPurchase);
purchaseRouter.get("/purchases", getPurchases);
purchaseRouter.get("/purchases/:id", getPurchase);
purchaseRouter.put("/purchases/:id", updatePurchase);
purchaseRouter.delete("/purchases/:id", deletePurchase);

export default purchaseRouter;
