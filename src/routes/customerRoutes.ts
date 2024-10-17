import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/controllers/customerController";
const customerRouter = express.Router();

customerRouter.post("/customers", createCustomer);
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomer);
customerRouter.put("/customers/:id", updateCustomer);
customerRouter.delete("/customers/:id", deleteCustomer);

export default customerRouter;
