import { db } from "@/db/db";
import { supplierService } from "@/services/supplierService";
import { Request, Response } from "express";

// Create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    return res.status(201).json(newSupplier);
  } catch (error: any) {
    console.error("Error creating Supplier:", error);
    return res
      .status(500)
      .json({ error: `Failed to create Supplier: ${error.message}` });
  }
};

// Get all suppliers
export const getSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    return res.status(200).json(suppliers);
  } catch (error: any) {
    console.error("Error getting Suppliers:", error);
    return res
      .status(500)
      .json({ error: `Failed to get Suppliers: ${error.message}` });
  }
};

// Get a single supplier by ID
export const getSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const supplier = await supplierService.getSupplier(id);
    return res.status(200).json(supplier);
  } catch (error: any) {
    console.error("Error getting Supplier:", error);
    return res
      .status(500)
      .json({ error: `Failed to get Supplier: ${error.message}` });
  }
};

// Update a supplier by ID
export const updateSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const supplier = await supplierService.updateSupplier(id, req.body);
    return res.status(200).json(supplier);
  } catch (error: any) {
    console.error("Error updating Supplier:", error);
    return res
      .status(500)
      .json({ error: `Failed to update Supplier: ${error.message}` });
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const supplier = await supplierService.deleteSupplier(id);
    return res.status(200).json(supplier);
  } catch (error: any) {
    console.error("Error deleting Supplier:", error);
    return res
      .status(500)
      .json({ error: `Failed to delete Supplier: ${error.message}` });
  }
};
