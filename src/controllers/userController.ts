import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    //check the field validation
    //check if the user exists by email, username and phone
    const userByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userByEmail) {
      res
        .status(409)
        .json({ error: `Email: ${email} is Already taken`, data: null });
      return;
    }

    const userByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (userByUsername) {
      res
        .status(409)
        .json({ error: `Username: ${username} is Already taken`, data: null });
      return;
    }

    const userByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (userByPhone) {
      res
        .status(409)
        .json({ error: `Phone Number: ${phone} is Already taken`, data: null });
      return;
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create the user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image: image
          ? image
          : "https://utfs.io/f/276c9ec4-bff3-40fc-8759-6b4c362c1e59-o0u7dg.png",
        role,
      },
    });
    //send verification code
    //modify the returned user
    const { password: string, ...modifiedUser } = newUser;
    return res.status(201).json({
      data: modifiedUser,
      message: "User created successfully",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      data: null,
      error: `Something went wrong: ${err.message}`,
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return res.status(200).json({
      data: modifiedUser,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      data: null,
      error: `Something went wrong: ${err.message}`,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: `User not found.`,
      });
    }
    const { password, ...modifiedUser } = user;
    return res.status(200).json({
      data: modifiedUser,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      data: null,
      error: `Something went wrong: ${error.message}`,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { email, username, firstName, lastName, phone, dob, gender, image } =
    req.body;

  try {
    // Find the user first
    const existingUser = await db.user.findUnique({
      where: { id },
      select: { id: true }, // Fetch only required data
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Perform the update
    const updatedUser = await db.user.update({
      where: { id },
      data: { email, username, firstName, lastName, phone, dob, gender, image },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }, // Select only the fields you want to return
    });

    return res
      .status(200)
      .json({ data: updatedUser, message: "User updated successfully" });
  } catch (error: any) {
    console.error("Error updating user:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Update User Password
export const updateUserPassword = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // Fetch the user's current password
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedUser = await db.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res
      .status(200)
      .json({ data: updatedUser, message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete the user
    const deletedUser = await db.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      data: deletedUser,
      message: `User deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getAttendants = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ATTENDANT",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return res.status(200).json({
      data: modifiedUser,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      data: null,
      error: `Something went wrong: ${err.message}`,
    });
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ADMIN",
      },
    });
    const modifiedUser = users?.map((user) => {
      const { password, ...otherViews } = user;
      return otherViews;
    });
    return res.status(200).json({
      data: modifiedUser,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      data: null,
      error: `Something went wrong: ${err.message}`,
    });
  }
};
