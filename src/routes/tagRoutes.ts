import express from "express";
import {
  createTag,
  deleteTag,
  getTag,
  getTags,
  updateTag,
} from "@/controllers/tagController";

const tagRouter = express.Router();

tagRouter.post("/tags", createTag);
tagRouter.get("/tags", getTags);
tagRouter.get("/tags/:id", getTag);
tagRouter.put("/tags/:id", updateTag);
tagRouter.delete("/tags/:id", deleteTag);

export default tagRouter;
