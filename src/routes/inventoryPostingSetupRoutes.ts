import express from "express";
import {
  createInventoryPostingSetup,
  deleteInventoryPostingSetup,
  getInventoryPostingSetup,
  getInventoryPostingSetups,
  updateInventoryPostingSetup,
} from "@/controllers/inventoryPostingSetupController";

const inventoryPostingSetupRouter = express.Router();

inventoryPostingSetupRouter.post(
  "/inventoryPostingSetups",
  createInventoryPostingSetup
);
inventoryPostingSetupRouter.get(
  "/inventoryPostingSetups",
  getInventoryPostingSetups
);
inventoryPostingSetupRouter.get(
  "/inventoryPostingSetups/:id",
  getInventoryPostingSetup
);
inventoryPostingSetupRouter.put(
  "/inventoryPostingSetups/:id",
  updateInventoryPostingSetup
);
inventoryPostingSetupRouter.delete(
  "/inventoryPostingSetups/:id",
  deleteInventoryPostingSetup
);

export default inventoryPostingSetupRouter;
