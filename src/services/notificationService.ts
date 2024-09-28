import { db } from "@/db/db";
import { Prisma } from "@prisma/client";
import { NotificationStatus } from "@prisma/client";

export const createNotification = async (
  notification: Prisma.NotificationCreateInput
) => {
  const { title, message, type } = notification;
  try {
    const newNotification = await db.notification.create({
      data: {
        title,
        message,
        type,
      },
    });
    return {
      data: newNotification,
      message: "Notification created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Notification:", error);
    throw new Error(error.message);
  }
};

export const getNotifications = async () => {
  try {
    const notifications = await db.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: notifications,
      message: "Notifications fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Notifications:", error);
    throw new Error(error.message);
  }
};

export const getNotification = async (id: string) => {
  try {
    const notification = await db.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    return {
      data: notification,
      message: "Notification fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Notification:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const updateNotification = async (
  id: string,
  notification: Prisma.NotificationCreateInput
) => {
  const { title, message, type } = notification;
  try {
    const notificationExists = await db.notification.findUnique({
      where: { id },
      select: { id: true, title: true, message: true, type: true },
    });
    if (!notificationExists) {
      throw new Error("Notification not found");
    }
    // Perform the update
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { title, message, type },
    });
    return {
      data: updatedNotification,
      message: "Notification updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Notification:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const deleteNotification = async (id: string) => {
  try {
    // Check if the notification exists
    const notification = await db.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    // Delete the notification
    const deletedNotification = await db.notification.delete({
      where: { id },
    });
    return {
      data: deletedNotification,
      message: "Notification deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Notification:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const notification = await db.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { status: NotificationStatus.READ },
    });
    return {
      data: updatedNotification,
      message: "Notification marked as read successfully",
    };
  } catch (error: any) {
    console.error("Error marking Notification as read:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const markNotificationAsUnread = async (id: string) => {
  try {
    const notification = await db.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!notification) {
      throw new Error("Notification not found");
    }
    const updatedNotification = await db.notification.update({
      where: { id },
      data: { status: NotificationStatus.UNREAD },
    });
    return {
      data: updatedNotification,
      message: "Notification marked as unread successfully",
    };
  } catch (error: any) {
    console.error("Error marking Notification as unread:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const notificationService = {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
};
