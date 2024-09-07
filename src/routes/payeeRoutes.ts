import express from "express";
import {
  createPayee,
  deletePayee,
  getPayee,
  getPayees,
  updatePayee,
} from "@/controllers/payeeController";

const payeeRouter = express.Router();

payeeRouter.post("/payees", createPayee);
payeeRouter.get("/payees", getPayees);
payeeRouter.get("/payees/:id", getPayee);
payeeRouter.put("/payees/:id", updatePayee);
payeeRouter.delete("/payees/:id", deletePayee);

export default payeeRouter;
