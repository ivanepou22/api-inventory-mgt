import express from "express";
import {
  createVatProductPostingGroup,
  deleteVatProductPostingGroup,
  getVatProductPostingGroup,
  getVatProductPostingGroups,
  updateVatProductPostingGroup,
} from "@/controllers/vatProdGroupController";

const vatProductPostingGroupRouter = express.Router();

vatProductPostingGroupRouter.post(
  "/vatProductPostingGroups",
  createVatProductPostingGroup
);
vatProductPostingGroupRouter.get(
  "/vatProductPostingGroups",
  getVatProductPostingGroups
);
vatProductPostingGroupRouter.get(
  "/vatProductPostingGroups/:id",
  getVatProductPostingGroup
);
vatProductPostingGroupRouter.put(
  "/vatProductPostingGroups/:id",
  updateVatProductPostingGroup
);
vatProductPostingGroupRouter.delete(
  "/vatProductPostingGroups/:id",
  deleteVatProductPostingGroup
);

export default vatProductPostingGroupRouter;
