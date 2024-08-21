import express from "express";
import {
  createCustomer,
  getCustomer,
  getCustomers,
} from "@/controllers/customerController";
const customerRouter = express.Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomer);
customerRouter.post("/customers", createCustomer);

export default customerRouter;
