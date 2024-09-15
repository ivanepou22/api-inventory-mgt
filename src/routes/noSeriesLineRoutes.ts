import { Router } from "express";
import {
  createNoSeriesLine,
  getNoSeriesLines,
  getNoSeriesLine,
  updateNoSeriesLine,
  deleteNoSeriesLine,
} from "@/controllers/noSeriesLineController";

const noSeriesLineRouter = Router();

noSeriesLineRouter.post("/noSeriesLines", createNoSeriesLine);
noSeriesLineRouter.get("/noSeriesLines", getNoSeriesLines);
noSeriesLineRouter.get("/noSeriesLines/:id", getNoSeriesLine);
noSeriesLineRouter.put("/noSeriesLines/:id", updateNoSeriesLine);
noSeriesLineRouter.delete("/noSeriesLines/:id", deleteNoSeriesLine);

export default noSeriesLineRouter;
