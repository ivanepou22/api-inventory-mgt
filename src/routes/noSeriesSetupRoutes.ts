import { Router } from "express";
import {
  createNoSeriesSetup,
  getNoSeriesSetups,
  getNoSeriesSetup,
  updateNoSeriesSetup,
  deleteNoSeriesSetup,
} from "@/controllers/noSeriesSetupController";

const noSeriesSetupRouter = Router();

noSeriesSetupRouter.post("/noSeriesSetup", createNoSeriesSetup);
noSeriesSetupRouter.get("/noSeriesSetup", getNoSeriesSetups);
noSeriesSetupRouter.get("/noSeriesSetup/:id", getNoSeriesSetup);
noSeriesSetupRouter.put("/noSeriesSetup/:id", updateNoSeriesSetup);
noSeriesSetupRouter.delete("/noSeriesSetup/:id", deleteNoSeriesSetup);

export default noSeriesSetupRouter;
