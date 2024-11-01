import { Router } from "express";
import {
  createCustomerContact,
  getCustomerContacts,
  getCustomerContact,
  updateCustomerContact,
  deleteCustomerContact,
} from "@/controllers/customerContactController";

const customerContactRouter = Router();

customerContactRouter.post("/customerContacts", createCustomerContact);
customerContactRouter.get("/customerContacts", getCustomerContacts);
customerContactRouter.get("/customerContacts/:id", getCustomerContact);
customerContactRouter.put("/customerContacts/:id", updateCustomerContact);
customerContactRouter.delete("/customerContacts/:id", deleteCustomerContact);

export default customerContactRouter;
