import express from "express";
import {
  createVatPostingSetup,
  deleteVatPostingSetup,
  getVatPostingSetup,
  getVatPostingSetups,
  updateVatPostingSetup,
} from "@/controllers/vatPostingSetupController";

const vatPostingSetupRouter = express.Router();

vatPostingSetupRouter.post("/vatPostingSetups", createVatPostingSetup);
vatPostingSetupRouter.get("/vatPostingSetups", getVatPostingSetups);
vatPostingSetupRouter.get("/vatPostingSetups/:id", getVatPostingSetup);
vatPostingSetupRouter.put("/vatPostingSetups/:id", updateVatPostingSetup);
vatPostingSetupRouter.delete("/vatPostingSetups/:id", deleteVatPostingSetup);

export default vatPostingSetupRouter;
