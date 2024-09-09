import express from "express";
import {
  createAdjustment,
  deleteAdjustment,
  getAdjustment,
  getAdjustments,
  updateAdjustment,
} from "@/controllers/adjustmentController";

const adjustmentRouter = express.Router();

adjustmentRouter.post("/adjustments", createAdjustment);
adjustmentRouter.get("/adjustments", getAdjustments);
adjustmentRouter.get("/adjustments/:id", getAdjustment);
adjustmentRouter.put("/adjustments/:id", updateAdjustment);
adjustmentRouter.delete("/adjustments/:id", deleteAdjustment);

export default adjustmentRouter;
