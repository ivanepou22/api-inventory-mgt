import { Request, Response } from "express";
import { loginService } from "@/services/loginService";

export const authorizeUser = async (req: Request, res: Response) => {
  try {
    const user = await loginService.authorizeUser(req.body);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error authorizing user:", error);
    return res.status(500).json({
      error: `Failed to authorize user: ${error.message}`,
    });
  }
};

//forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await loginService.forgotPassword(req.body);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error forgot password:", error);
    return res.status(500).json({
      error: `Failed to forgot password: ${error.message}`,
    });
  }
};

//verify reset token, verify token expiry and reset password
export const verifyResetToken = async (req: Request, res: Response) => {
  const { resetToken } = req.body;
  try {
    const user = await loginService.verifyResetToken(resetToken);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error verifying reset token:", error);
    return res.status(500).json({
      error: `Failed to verify reset token: ${error.message}`,
    });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await loginService.resetPassword(resetToken, newPassword);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      error: `Failed to reset password: ${error.message}`,
    });
  }
};
