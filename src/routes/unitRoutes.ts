import express from "express";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnits,
  updateUnit,
} from "@/controllers/unitController";

const unitRouter = express.Router();

unitRouter.post("/units", createUnit);
unitRouter.get("/units", getUnits);
unitRouter.get("/units/:id", getUnit);
unitRouter.put("/units/:id", updateUnit);
unitRouter.delete("/units/:id", deleteUnit);

export default unitRouter;
