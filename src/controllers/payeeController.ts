import { payeeService } from "@/services/payeeService";
import { Request, Response } from "express";

export const createPayee = async (req: Request, res: Response) => {
  try {
    const newPayee = await payeeService.createPayee(req.body);
    return res.status(201).json(newPayee);
  } catch (error: any) {
    console.error("Error creating Payee:", error);
    return res.status(500).json({
      error: `Failed to create Payee: ${error.message}`,
    });
  }
};

export const getPayees = async (_req: Request, res: Response) => {
  try {
    const payees = await payeeService.getPayees();
    return res.status(200).json(payees);
  } catch (error: any) {
    console.error("Error fetching Payees:", error);
    return res.status(500).json({
      error: `Failed to fetch Payees: ${error.message}`,
    });
  }
};

export const getPayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const payee = await payeeService.getPayee(id);
    return res.status(200).json(payee);
  } catch (error: any) {
    console.error("Error fetching Payee:", error);
    return res.status(500).json({
      error: `Failed to fetch Payee: ${error.message}`,
    });
  }
};

export const updatePayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedPayee = await payeeService.updatePayee(id, req.body);
    return res.status(200).json(updatedPayee);
  } catch (error: any) {
    console.error("Error updating Payee:", error.message);
    return res.status(500).json({
      error: `Failed to update Payee: ${error.message}`,
    });
  }
};

export const deletePayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedPayee = await payeeService.deletePayee(id);
    return res.status(200).json(deletedPayee);
  } catch (error: any) {
    console.error("Error deleting Payee:", error.message);
    return res.status(500).json({
      error: `Failed to delete Payee: ${error.message}`,
    });
  }
};
