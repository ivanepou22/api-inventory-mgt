import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  updateNotification,
} from "@/controllers/notificationController";

const notificationRouter = express.Router();

notificationRouter.post("/notifications", createNotification);
notificationRouter.get("/notifications", getNotifications);
notificationRouter.get("/notifications/:id", getNotification);
notificationRouter.put("/notifications/:id", updateNotification);
notificationRouter.delete("/notifications/:id", deleteNotification);
notificationRouter.put("/notifications/read/:id", markNotificationAsRead);
notificationRouter.put("/notifications/unread/:id", markNotificationAsUnread);

export default notificationRouter;
