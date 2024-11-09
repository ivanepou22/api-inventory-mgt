import { Router } from "express";
import {
  createItemUnit,
  deleteItemUnit,
  getItemUnit,
  getItemUnits,
  updateItemUnit,
} from "@/controllers/itemUnitController";

const itemUnitRouter = Router();

itemUnitRouter.post("/itemUnits", createItemUnit);
itemUnitRouter.get("/itemUnits", getItemUnits);
itemUnitRouter.get("/itemUnits/:id", getItemUnit);
itemUnitRouter.put("/itemUnits/:id", updateItemUnit);
itemUnitRouter.delete("/itemUnits/:id", deleteItemUnit);

export default itemUnitRouter;
