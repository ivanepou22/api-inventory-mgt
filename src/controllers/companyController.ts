import { Response } from "express";
import { companyService } from "@/services/companyService";
import { RequestWithTenant } from "@/utils/types";

export const createCompany = async (req: RequestWithTenant, res: Response) => {
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.createCompany(
      req.body,
      req.tenantId
    );
    return res.status(201).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create company: ${error.message}` });
  }
};

export const getCompanies = async (req: RequestWithTenant, res: Response) => {
  try {
    const companyServiceInstance = companyService();
    const companies = await companyServiceInstance.getCompanies(req.tenantId);
    return res.status(200).json(companies);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get companies: ${error.message}` });
  }
};

export const getCompany = async (req: RequestWithTenant, res: Response) => {
  const id = req.params.id;
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.getCompany(id, req.tenantId);
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get company: ${error.message}` });
  }
};

export const updateCompany = async (req: RequestWithTenant, res: Response) => {
  try {
    const companyServiceInstance = companyService();
    const { id } = req.params;
    const company = await companyServiceInstance.updateCompany(
      id,
      req.body,
      req.tenantId
    );
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update company: ${error.message}` });
  }
};

export const deleteCompany = async (req: RequestWithTenant, res: Response) => {
  const id = req.params.id;
  try {
    const companyServiceInstance = companyService();
    const company = await companyServiceInstance.deleteCompany(
      id,
      req.tenantId
    );
    return res.status(200).json(company);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete company: ${error.message}` });
  }
};
