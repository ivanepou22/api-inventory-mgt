import { Request, Response } from "express";
import { salesPersonService } from "@/services/salesPersonService";

export const salesPersonController = {
  async createSalesPerson(req: Request, res: Response) {
    try {
      const salesPerson = await salesPersonService().createSalesPerson(
        req.body
      );
      return res.status(201).json(salesPerson);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Failed to create No Series: ${error.message}` });
    }
  },
  async getSalesPersons(_req: Request, res: Response) {
    try {
      const salesPersons = await salesPersonService().getSalesPersons();
      return res.status(200).json(salesPersons);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Failed to create No Series: ${error.message}` });
    }
  },
  async getSalesPerson(req: Request, res: Response) {
    try {
      const salesPerson = await salesPersonService().getSalesPerson(
        req.params.id
      );
      return res.status(200).json(salesPerson);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Failed to create No Series: ${error.message}` });
    }
  },
  async updateSalesPerson(req: Request, res: Response) {
    try {
      const salesPerson = await salesPersonService().updateSalesPerson(
        req.params.id,
        req.body
      );
      return res.status(200).json(salesPerson);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Failed to create No Series: ${error.message}` });
    }
  },
  async deleteSalesPerson(req: Request, res: Response) {
    try {
      const salesPerson = await salesPersonService().deleteSalesPerson(
        req.params.id
      );
      return res.status(200).json(salesPerson);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Failed to create No Series: ${error.message}` });
    }
  },
};
