import express from "express";
import {
  createOnlineOrderSetup,
  getOnlineOrderSetups,
  getOnlineOrderSetup,
  updateOnlineOrderSetup,
  deleteOnlineOrderSetup,
} from "@/controllers/onlineOrderSetupController";

const onlineOrderSetupRouter = express.Router();

onlineOrderSetupRouter.post("onlineOrderSetups", createOnlineOrderSetup);
onlineOrderSetupRouter.get("onlineOrderSetups/", getOnlineOrderSetups);
onlineOrderSetupRouter.get("onlineOrderSetups/:id", getOnlineOrderSetup);
onlineOrderSetupRouter.put("onlineOrderSetups/:id", updateOnlineOrderSetup);
onlineOrderSetupRouter.delete("onlineOrderSetups/:id", deleteOnlineOrderSetup);

export default onlineOrderSetupRouter;
