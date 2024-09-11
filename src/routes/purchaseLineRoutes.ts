import express from "express";
import {
  // createPurchaseLine,
  deletePurchaseLine,
  getPurchaseLine,
  getPurchaseLines,
  updatePurchaseLine,
} from "@/controllers/purchaseLineController";

const purchaseLineRouter = express.Router();

// purchaseLineRouter.post("/purchase-lines", createPurchaseLine);
purchaseLineRouter.get("/purchase-lines", getPurchaseLines);
purchaseLineRouter.get("/purchase-lines/:id", getPurchaseLine);
purchaseLineRouter.put("/purchase-lines/:id", updatePurchaseLine);
purchaseLineRouter.delete("/purchase-lines/:id", deletePurchaseLine);

export default purchaseLineRouter;
