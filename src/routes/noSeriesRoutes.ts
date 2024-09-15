import { Router } from "express";
import {
  createNoSeries,
  getNoSeries,
  getNoSeriesById,
  updateNoSeries,
  deleteNoSeries,
} from "@/controllers/noSeriesController";

const noSeriesRouter = Router();

noSeriesRouter.post("/noSeries", createNoSeries);
noSeriesRouter.get("/noSeries", getNoSeries);
noSeriesRouter.get("/noSeries/:id", getNoSeriesById);
noSeriesRouter.put("/noSeries/:id", updateNoSeries);
noSeriesRouter.delete("/noSeries/:id", deleteNoSeries);

export default noSeriesRouter;
