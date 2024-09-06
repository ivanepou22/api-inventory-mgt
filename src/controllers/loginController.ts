import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/jwt";
import nodemailer from "nodemailer";
import { generateEmailHTML } from "@/utils/functions";

export const authorizeUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let existingUser = null;
    if (email) {
      existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });
    }
    if (username) {
      existingUser = await db.user.findUnique({
        where: {
          username,
        },
      });
    }
    if (!existingUser) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    const isMatchingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isMatchingPassword) {
      return res.status(403).json({
        error: "Password provided does not match, please try again",
      });
    }
    const { password: userPassword, ...filteredUser } = existingUser;
    const accessToken = await generateAccessToken(filteredUser);
    const result = { ...filteredUser, accessToken };
    return res.status(200).json(result);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      data: null,
      error: `Something went wrong, please try again`,
    });
  }
};

//forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    const resetToken = await generateResetToken(user.id);

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: generateEmailHTML({ token: resetToken }),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: `Reset token sent to ${user.email}`,
      data: {
        email: user.email,
        token: resetToken,
      },
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      data: null,
      error: `Something went wrong, please try again`,
    });
  }
};

//generate reset token
const generateResetToken = async (userId: string) => {
  const resetToken = Math.floor(10000 + Math.random() * 90000).toString();
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  await db.user.update({
    where: { id: userId },
    data: { resetToken, resetTokenExpiry },
  });
  return resetToken;
};

//verify reset token, verify token expiry and reset password
export const verifyResetToken = async (req: Request, res: Response) => {
  const { resetToken } = req.body;
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        error: "Invalid or expired reset token",
      });
    }
    return res.status(200).json({
      message: "Reset token is valid",
      data: {
        email: user.email,
        token: resetToken,
      },
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      error: `Something went wrong, please try again`,
    });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        error: "Invalid or expired reset token",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      data: null,
      error: `Something went wrong, please try again`,
    });
  }
};
