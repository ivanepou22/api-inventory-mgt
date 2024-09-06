import express from "express";
import {
  authorizeUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "@/controllers/loginController";

const loginRouter = express.Router();
loginRouter.post("/auth/login", authorizeUser);
loginRouter.post("/auth/forgot-password", forgotPassword);
loginRouter.post("/auth/verify-reset-token", verifyResetToken);
loginRouter.post("/auth/reset-password", resetPassword);

export default loginRouter;
