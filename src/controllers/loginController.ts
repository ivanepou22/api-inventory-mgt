import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/jwt";

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
