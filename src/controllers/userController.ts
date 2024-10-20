import { Request, Response } from "express";
import { userService } from "@/services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const userServiceInstance = userService();
    const newUser = await userServiceInstance.createUser(req.body);
    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating User:", error);
    return res.status(500).json({
      error: `Failed to create user: ${error.message}`,
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const userServiceInstance = userService();
    const users = await userServiceInstance.getUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: `Failed to fetch users: ${error.message}`,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const userServiceInstance = userService();
    const user = await userServiceInstance.getUser(id);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      error: `Failed to fetch user: ${error.message}`,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const userServiceInstance = userService();
    const user = await userServiceInstance.updateUser(id, req.body);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error updating User:", error);
    return res.status(500).json({
      error: `Failed to update user: ${error.message}`,
    });
  }
};

// Update User Password
export const updateUserPassword = async (req: Request, res: Response) => {
  const userServiceInstance = userService();
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await userServiceInstance.updateUserPassword(
      id,
      oldPassword,
      newPassword
    );
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error updating User Password:", error);
    return res.status(500).json({
      error: `Failed to update user password: ${error.message}`,
    });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const userServiceInstance = userService();
  const id = req.params.id;
  try {
    const user = await userServiceInstance.deleteUser(id);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error deleting User:", error);
    return res.status(500).json({
      error: `Failed to delete user: ${error.message}`,
    });
  }
};

export const getAttendants = async (_req: Request, res: Response) => {
  try {
    const userServiceInstance = userService();
    const attendants = await userServiceInstance.getAttendants();
    return res.status(200).json(attendants);
  } catch (error: any) {
    console.error("Error fetching attendants:", error);
    return res.status(500).json({
      error: `Failed to fetch attendants: ${error.message}`,
    });
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const userServiceInstance = userService();
    const admins = await userServiceInstance.getAdmins();
    return res.status(200).json(admins);
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `Failed to fetch admins: ${err.message}`,
    });
  }
};
