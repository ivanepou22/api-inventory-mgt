import express from "express";
import {
  createVendorPostingGroup,
  deleteVendorPostingGroup,
  getVendorPostingGroup,
  getVendorPostingGroups,
  updateVendorPostingGroup,
} from "@/controllers/vendorPostingGroupController";

const vendorPostingGroupRouter = express.Router();

vendorPostingGroupRouter.post("/vendorPostingGroups", createVendorPostingGroup);
vendorPostingGroupRouter.get("/vendorPostingGroups", getVendorPostingGroups);
vendorPostingGroupRouter.get("/vendorPostingGroups/:id", getVendorPostingGroup);
vendorPostingGroupRouter.put(
  "/vendorPostingGroups/:id",
  updateVendorPostingGroup
);
vendorPostingGroupRouter.delete(
  "/vendorPostingGroups/:id",
  deleteVendorPostingGroup
);

export default vendorPostingGroupRouter;
