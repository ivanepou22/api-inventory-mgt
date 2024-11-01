import { Request, Response } from "express";
import { customerContactService } from "@/services/customerContactService";

export const customerContactController = {
  async createCustomerContact(req: Request, res: Response) {
    try {
      const newCustomerContact =
        await customerContactService().createCustomerContact(req.body);
      return res.status(201).json(newCustomerContact);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export const getCustomerContacts = async (req: Request, res: Response) => {
  try {
    const customerContacts =
      await customerContactService().getCustomerContacts();
    return res.status(200).json(customerContacts);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCustomerContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerContact = await customerContactService().getCustomerContact(
      id
    );
    return res.status(200).json(customerContact);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCustomerContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCustomerContact =
      await customerContactService().updateCustomerContact(id, req.body);
    return res.status(200).json(updatedCustomerContact);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCustomerContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, message } =
      await customerContactService().deleteCustomerContact(id);
    return res.status(200).json({ data, message });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
