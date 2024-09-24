import { customerService } from "@/services/customerService";
import { Request, Response } from "express";

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    return res.status(201).json(customer);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create customer: ${error.message}` });
  }
};

// Get all customers
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customerService.getCustomers();
    return res.status(200).json(customers);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get customers: ${error.message}` });
  }
};

// Get a single customer by ID
export const getCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await customerService.getCustomer(id);
    return res.status(200).json(customer);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get customer: ${error.message}` });
  }
};

// Update a customer by ID
export const updateCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await customerService.updateCustomer(id, req.body);
    return res.status(200).json(customer);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update customer: ${error.message}` });
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await customerService.deleteCustomer(id);
    return res.status(200).json(customer);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete customer: ${error.message}` });
  }
};
