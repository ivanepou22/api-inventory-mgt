import { db } from "@/db/db";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/jwt";
import nodemailer from "nodemailer";
import { generateEmailHTML } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const authorizeUser = async (user: Prisma.UserCreateInput) => {
  const { email, username, password } = user;
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
      throw new Error("User not found.");
    }
    const isMatchingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isMatchingPassword) {
      throw new Error("Password provided does not match, please try again");
    }
    const { password: userPassword, ...filteredUser } = existingUser;
    const accessToken = await generateAccessToken(filteredUser);
    const result = { ...filteredUser, accessToken };
    return { data: result, message: "User logged in successfully" };
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw new Error(error.message);
  }
};

const forgotPassword = async (user: Prisma.UserCreateInput) => {
  const { email } = user;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found.");
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

    return {
      message: `Reset token sent to ${user.email}`,
      data: {
        email: user.email,
        token: resetToken,
      },
    };
  } catch (error: any) {
    console.error("Error logging out:", error);
    throw new Error(error.message);
  }
};

///verify reset token, verify token expiry and reset password
const verifyResetToken = async (resetToken: string) => {
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
      throw new Error("Invalid or expired reset token");
    }
    return {
      message: "Reset token is valid",
      data: {
        email: user.email,
        token: resetToken,
      },
    };
  } catch (error: any) {
    console.error("Error verifying reset token:", error);
    throw new Error(error.message);
  }
};

//reset password
const resetPassword = async (resetToken: string, newPassword: string) => {
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
      throw new Error("Invalid or expired reset token");
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
    return {
      message: "Password reset successful",
    };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error.message);
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

export const loginService = {
  authorizeUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
