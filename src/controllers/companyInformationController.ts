import { Request, Response } from "express";
import { companyInformationService } from "@/services/companyInformationService";

export const createCompanyInformation = async (req: Request, res: Response) => {
  try {
    const companyInformation =
      await companyInformationService.createCompanyInformation(req.body);
    return res.status(201).json(companyInformation);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to create company information: ${error.message}`,
    });
  }
};

export const getCompanyInformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyInformation =
      await companyInformationService.getCompanyInformationById(id);
    return res.status(200).json(companyInformation);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get company information: ${error.message}` });
  }
};

export const updateCompanyInformation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const companyInformation =
      await companyInformationService.updateCompanyInformation(id, req.body);
    return res.status(200).json(companyInformation);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to update company information: ${error.message}`,
    });
  }
};

export const deleteCompanyInformation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const companyInformation =
      await companyInformationService.deleteCompanyInformation(id);
    return res.status(200).json(companyInformation);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to delete company information: ${error.message}`,
    });
  }
};
