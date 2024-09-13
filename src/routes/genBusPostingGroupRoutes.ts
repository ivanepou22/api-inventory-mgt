import express from "express";
import {
  createGenBusPostingGroup,
  deleteGenBusPostingGroup,
  getGenBusPostingGroup,
  getGenBusPostingGroups,
  updateGenBusPostingGroup,
} from "@/controllers/genBusPostingGroupController";

const genBusPostingGroupRouter = express.Router();

genBusPostingGroupRouter.post("/genBusPostingGroups", createGenBusPostingGroup);
genBusPostingGroupRouter.get("/genBusPostingGroups", getGenBusPostingGroups);
genBusPostingGroupRouter.get("/genBusPostingGroups/:id", getGenBusPostingGroup);
genBusPostingGroupRouter.put(
  "/genBusPostingGroups/:id",
  updateGenBusPostingGroup
);
genBusPostingGroupRouter.delete(
  "/genBusPostingGroups/:id",
  deleteGenBusPostingGroup
);

export default genBusPostingGroupRouter;
