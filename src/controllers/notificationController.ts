import { Request, Response } from "express";
import { notificationService } from "@/services/notificationService";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const newNotification = await notificationService.createNotification(
      req.body
    );
    return res.status(200).json({
      data: newNotification.data,
      message: newNotification.message,
    });
  } catch (error: any) {
    console.error("Error creating Notification:", error);
    return res.status(500).json(error.message);
  }
};

export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getNotifications();
    return res.status(200).json(notifications);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const getNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const notification = await notificationService.getNotification(id);
    return res.status(200).json(notification);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedNotification = await notificationService.updateNotification(
      id,
      req.body
    );
    return res.status(200).json(updatedNotification);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

//delete
export const deleteNotification = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedNotification = await notificationService.deleteNotification(
      id
    );
    return res.status(200).json(deletedNotification);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedNotification =
      await notificationService.markNotificationAsRead(id);
    return res.status(200).json(updatedNotification);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const markNotificationAsUnread = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedNotification =
      await notificationService.markNotificationAsUnread(id);
    return res.status(200).json(updatedNotification);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};
