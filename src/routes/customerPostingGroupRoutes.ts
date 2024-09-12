import {
  createCustomerPostingGroup,
  deleteCustomerPostingGroup,
  getCustomerPostingGroup,
  getCustomerPostingGroups,
  updateCustomerPostingGroup,
} from "@/controllers/customerPostingGroupController";
import express from "express";

const customerPostingGroupRouter = express.Router();

customerPostingGroupRouter.post(
  "/customerPostingGroups",
  createCustomerPostingGroup
);
customerPostingGroupRouter.get(
  "/customerPostingGroups",
  getCustomerPostingGroups
);
customerPostingGroupRouter.get(
  "/customerPostingGroups/:id",
  getCustomerPostingGroup
);
customerPostingGroupRouter.put(
  "/customerPostingGroups/:id",
  updateCustomerPostingGroup
);
customerPostingGroupRouter.delete(
  "/customerPostingGroups/:id",
  deleteCustomerPostingGroup
);

export default customerPostingGroupRouter;
