import { Request, Response } from "express";
import { contactService } from "@/services/contactService";

export const contactController = {
  async createContact(req: Request, res: Response) {
    try {
      const { data, message } = await contactService().createContact(req.body);
      return res.status(201).json({ data, message });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getContacts(req: Request, res: Response) {
    try {
      const contacts = await contactService().getContacts();
      return res.status(200).json(contacts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const contact = await contactService().getContact(id);
      return res.status(200).json(contact);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedContact = await contactService().updateContact(id, req.body);
      return res.status(200).json(updatedContact);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async deleteContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, message } = await contactService().deleteContact(id);
      return res.status(200).json({ data, message });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
