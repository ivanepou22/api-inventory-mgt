import express from "express";
import { authorizeUser } from "@/controllers/loginController";

const loginRouter = express.Router();
loginRouter.post("/auth/login", authorizeUser);
export default loginRouter;
