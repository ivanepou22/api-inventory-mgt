import express from "express";
import {
  createVatBusPostingGroup,
  deleteVatBusPostingGroup,
  getVatBusPostingGroup,
  getVatBusPostingGroups,
  updateVatBusPostingGroup,
} from "@/controllers/vatBusPostingGroupController";

const vatBusPostingGroupRouter = express.Router();

vatBusPostingGroupRouter.post("/vatBusPostingGroups", createVatBusPostingGroup);
vatBusPostingGroupRouter.get("/vatBusPostingGroups", getVatBusPostingGroups);
vatBusPostingGroupRouter.get("/vatBusPostingGroups/:id", getVatBusPostingGroup);
vatBusPostingGroupRouter.put(
  "/vatBusPostingGroups/:id",
  updateVatBusPostingGroup
);
vatBusPostingGroupRouter.delete(
  "/vatBusPostingGroups/:id",
  deleteVatBusPostingGroup
);

export default vatBusPostingGroupRouter;
