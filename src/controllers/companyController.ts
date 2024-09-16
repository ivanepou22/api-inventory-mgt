import { Request, Response } from "express";
import { db } from "@/db/db";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { code, name, tenantId }: any = req.body;

    //check if the tenant exists
    const tenantExists = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenantExists) {
      return res.status(404).json({
        error: "Tenant not found",
      });
    }

    const companyCodeExists = await db.company.findUnique({
      where: {
        tenantId_code: {
          code,
          tenantId,
        },
      },
    });
    if (companyCodeExists) {
      return res.status(400).json({
        error: "Company code already exists",
      });
    }

    const company = await db.company.create({
      data: {
        code,
        name,
        tenantId,
        tenantName: tenantExists.name,
      },
    });
    return res.status(201).json({
      data: company,
      message: "Company created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Company:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while creating the Company.`,
    });
  }
};

export const getCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await db.company.findMany();
    return res.status(200).json({
      data: companies,
      message: "Companies fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Companies:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching Companies.",
    });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await db.company.findUnique({
      where: { id },
    });

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    return res.status(200).json({
      data: company,
      message: "Company fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Company:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Company.`,
    });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code }: any = req.body;

    //check if the company exists
    const companyExists = await db.company.findUnique({
      where: { id },
    });
    if (!companyExists) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    if (code && code !== companyExists.code) {
      const companyCodeExists = await db.company.findUnique({
        where: {
          tenantId_code: {
            code,
            tenantId: companyExists.tenantId,
          },
        },
      });
      if (companyCodeExists) {
        return res.status(400).json({
          error: "Company code already exists",
        });
      }
    }

    const company = await db.company.update({
      where: { id },
      data: { name, code },
    });
    return res.status(200).json({
      data: company,
      message: "Company updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Company:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Company.`,
    });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await db.company.findUnique({
      where: { id },
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    const companyDeleted = await db.company.delete({
      where: { id },
    });
    return res.status(200).json({
      data: companyDeleted,
      message: "Company deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Company:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Company.`,
    });
  }
};
