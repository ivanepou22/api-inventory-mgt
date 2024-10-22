import express from "express";
import { companyUserMiddleware } from "@/middleware/companyUserMiddleware";
import {
  createUser,
  deleteUser,
  getAdmins,
  getAttendants,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
} from "@/controllers/userController";
const userRouter = express.Router();

userRouter.post("/users", companyUserMiddleware, createUser);
userRouter.get("/users", companyUserMiddleware, getUsers);
userRouter.get("/users/attendants", companyUserMiddleware, getAttendants);
userRouter.get("/users/admins", companyUserMiddleware, getAdmins);
userRouter.get("/users/:id", companyUserMiddleware, getUser);
userRouter.put("/users/:id", companyUserMiddleware, updateUser);
userRouter.put(
  "/users/update-password/:id",
  companyUserMiddleware,
  updateUserPassword
);
userRouter.delete("/users/:id", companyUserMiddleware, deleteUser);

export default userRouter;
