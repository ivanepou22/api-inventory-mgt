import express from "express";
import {
  createInventoryPostingGroup,
  deleteInventoryPostingGroup,
  getInventoryPostingGroup,
  getInventoryPostingGroups,
  updateInventoryPostingGroup,
} from "@/controllers/InventoryPostingGroupController";

const inventoryPostingGroupRouter = express.Router();

inventoryPostingGroupRouter.post(
  "/inventoryPostingGroups",
  createInventoryPostingGroup
);
inventoryPostingGroupRouter.get(
  "/inventoryPostingGroups",
  getInventoryPostingGroups
);
inventoryPostingGroupRouter.get(
  "/inventoryPostingGroups/:id",
  getInventoryPostingGroup
);
inventoryPostingGroupRouter.put(
  "/inventoryPostingGroups/:id",
  updateInventoryPostingGroup
);
inventoryPostingGroupRouter.delete(
  "/inventoryPostingGroups/:id",
  deleteInventoryPostingGroup
);

export default inventoryPostingGroupRouter;
