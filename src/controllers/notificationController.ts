import { db } from "@/db/db";
import { Request, Response } from "express";
import { NotificationStatus } from "@prisma/client";

export const createNotification = async (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  try {
    const newNotification = await db.notification.create({
      data: {
        title,
        message,
        type,
      },
    });
    return res.status(201).json({
      data: newNotification,
      error: null,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error creating Notification:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await db.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: notifications,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const notification = await db.notification.findUnique({
      where: {
        id,
      },
    });
    if (!notification) {
      return res.status(404).json({
        data: null,
        error: `Notification not found.`,
      });
    }
    return res.status(200).json({
      data: notification,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, message, type } = req.body;
  try {
    const notificationExists = await db.notification.findUnique({
      where: { id },
      select: { id: true, title: true, message: true, type: true },
    });
    if (!notificationExists) {
      return res.status(404).json({ error: "Notification not found." });
    }
    // Perform the update
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { title, message, type },
    });
    return res.status(200).json({
      data: updatedNotification,
      message: "Notification updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Notification:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the notification exists
    const notification = await db.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    // Delete the notification
    const deletedNotification = await db.notification.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedNotification,
      message: `Notification deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Notification:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const notification = await db.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { status: NotificationStatus.READ },
    });
    return res.status(200).json({
      data: updatedNotification,
      message: "Notification marked as read successfully",
    });
  } catch (error: any) {
    console.error("Error marking Notification as read:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const markNotificationAsUnread = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const notification = await db.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { status: NotificationStatus.UNREAD },
    });
    return res.status(200).json({
      data: updatedNotification,
      message: "Notification marked as unread successfully",
    });
  } catch (error: any) {
    console.error("Error marking Notification as unread:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
