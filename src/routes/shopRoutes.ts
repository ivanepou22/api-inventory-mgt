import {
  createShop,
  deleteShop,
  getShop,
  getShopAttendants,
  getShops,
  updateShop,
} from "@/controllers/shopController";
import express from "express";

const shopRouter = express.Router();

shopRouter.post("/shops", createShop);
shopRouter.get("/shops", getShops);
shopRouter.get("/shops/:id", getShop);
shopRouter.get("/attendants/shop/:id", getShopAttendants);
shopRouter.put("/shops/:id", updateShop);
shopRouter.delete("/shops/:id", deleteShop);

export default shopRouter;