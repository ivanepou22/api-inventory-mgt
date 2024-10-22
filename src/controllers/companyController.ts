import { Request, Response } from "express";
import { companyService } from "@/services/companyService";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.createCompany(req.body);
    return res.status(201).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create company: ${error.message}` });
  }
};

export const getCompanies = async (_req: Request, res: Response) => {
  try {
    const companyServiceInstance = companyService();
    const companies = await companyServiceInstance.getCompanies();
    return res.status(200).json(companies);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get companies: ${error.message}` });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.getCompany(id);
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get company: ${error.message}` });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.updateCompany(id, req.body);
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update company: ${error.message}` });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.deleteCompany(id);
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete company: ${error.message}` });
  }
};
