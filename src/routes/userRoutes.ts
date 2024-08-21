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
import express from "express";
const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users", getUsers);
userRouter.get("/users/attendants", getAttendants);
userRouter.get("/users/admins", getAdmins);
userRouter.get("/users/:id", getUser);
userRouter.put("/users/:id", updateUser);
userRouter.put("/users/update-password/:id", updateUserPassword);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
