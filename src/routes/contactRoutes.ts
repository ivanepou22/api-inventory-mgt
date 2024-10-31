import express from "express";
import { contactController } from "@/controllers/contactController";

const contactRouter = express.Router();

contactRouter.post("contacts/", contactController.createContact);
contactRouter.get("contacts/", contactController.getContacts);
contactRouter.get("contacts/:id", contactController.getContact);
contactRouter.put("contacts/:id", contactController.updateContact);
contactRouter.delete("contacts/:id", contactController.deleteContact);

export default contactRouter;
