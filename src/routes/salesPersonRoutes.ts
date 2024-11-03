import { Router } from "express";
import { salesPersonController } from "../controllers/salesPersonController";

const salesPersonRouter = Router();

salesPersonRouter.post(
  "/salesPersons",
  salesPersonController.createSalesPerson
);
salesPersonRouter.get("/salesPersons", salesPersonController.getSalesPersons);
salesPersonRouter.get(
  "/salesPersons/:id",
  salesPersonController.getSalesPerson
);
salesPersonRouter.put(
  "/salesPersons/:id",
  salesPersonController.updateSalesPerson
);
salesPersonRouter.delete(
  "/salesPersons/:id",
  salesPersonController.deleteSalesPerson
);

export default salesPersonRouter;
