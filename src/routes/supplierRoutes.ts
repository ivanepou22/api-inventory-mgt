import express from "express";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "@/controllers/supplierController";
const supplierRouter = express.Router();

supplierRouter.post("/suppliers", createSupplier);
supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.get("/suppliers/:id", getSuppliers);
supplierRouter.put("/suppliers/:id", updateSupplier);
supplierRouter.delete("/suppliers/:id", deleteSupplier);

export default supplierRouter;
