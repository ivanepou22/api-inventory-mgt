import express from "express";
import {
  createGenProductPostingGroup,
  deleteGenProductPostingGroup,
  getGenProductPostingGroup,
  getGenProductPostingGroups,
  updateGenProductPostingGroup,
} from "@/controllers/genProductPostingGroupController";

const genProductPostingGroupRouter = express.Router();

genProductPostingGroupRouter.post(
  "/genProductPostingGroups",
  createGenProductPostingGroup
);
genProductPostingGroupRouter.get(
  "/genProductPostingGroups",
  getGenProductPostingGroups
);
genProductPostingGroupRouter.get(
  "/genProductPostingGroups/:id",
  getGenProductPostingGroup
);
genProductPostingGroupRouter.put(
  "/genProductPostingGroups/:id",
  updateGenProductPostingGroup
);
genProductPostingGroupRouter.delete(
  "/genProductPostingGroups/:id",
  deleteGenProductPostingGroup
);

export default genProductPostingGroupRouter;
