import { db } from "@/db/db";
import { Request, Response } from "express";

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Name, email, and phone are required" });
  }

  try {
    const newCustomer = await db.customer.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return res.status(201).json({
      data: newCustomer,
      message: "Customer created Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create customer" });
  }
};

// Get all customers
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve customers" });
  }
};

// Get a single customer by ID
export const getCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json({
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve customer" });
  }
};

// Update a customer by ID
export const updateCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({
      error:
        "At least one field (name, email, or phone) is required for update",
    });
  }

  try {
    const existingCustomer = await db.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const updatedCustomer = await db.customer.update({
      where: { id },
      data: {
        name: name || existingCustomer.name,
        email: email || existingCustomer.email,
        phone: phone || existingCustomer.phone,
      },
    });

    return res.status(200).json({
      data: updatedCustomer,
      message: `Customer updated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const existingCustomer = await db.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await db.customer.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Customer deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete customer" });
  }
};
