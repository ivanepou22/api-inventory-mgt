import { Request, Response } from "express";
import { customerService } from "@/services/customerService";

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customerServiceInstance = customerService();
    const customer = await customerServiceInstance.createCustomer(req.body);
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
    const customerServiceInstance = customerService();
    const customers = await customerServiceInstance.getCustomers();
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
    const customerServiceInstance = customerService();
    const customer = await customerServiceInstance.getCustomer(id);
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
    const customerServiceInstance = customerService();
    const customer = await customerServiceInstance.updateCustomer(id, req.body);
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
    const customerServiceInstance = customerService();
    const customer = await customerServiceInstance.deleteCustomer(id);
    return res.status(200).json(customer);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete customer: ${error.message}` });
  }
};
