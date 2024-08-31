import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "@/controllers/brandController";

const brandRouter = express.Router();

brandRouter.post("/brands", createBrand);
brandRouter.get("/brands", getBrands);
brandRouter.get("/brands/:id", getBrand);
brandRouter.put("/brands/:id", updateBrand);
brandRouter.delete("/brands/:id", deleteBrand);

export default brandRouter;
