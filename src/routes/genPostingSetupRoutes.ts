import express from "express";
import {
  createGenPostingSetup,
  deleteGenPostingSetup,
  getGenPostingSetup,
  getGenPostingSetups,
  updateGenPostingSetup,
} from "@/controllers/genPostingSetupController";

const genPostingSetupRouter = express.Router();

genPostingSetupRouter.post("/genPostingSetups", createGenPostingSetup);
genPostingSetupRouter.get("/genPostingSetups", getGenPostingSetups);
genPostingSetupRouter.get("/genPostingSetups/:id", getGenPostingSetup);
genPostingSetupRouter.put("/genPostingSetups/:id", updateGenPostingSetup);
genPostingSetupRouter.delete("/genPostingSetups/:id", deleteGenPostingSetup);

export default genPostingSetupRouter;
