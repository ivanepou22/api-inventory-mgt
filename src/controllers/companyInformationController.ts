import { Request, Response } from "express";
import { db } from "@/db/db";

export const createCompanyInformation = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      address_2,
      city,
      state,
      zip,
      country,
      contactName,
      phone,
      email,
      website,
      fax,
      taxRegNo,
      logo,
      bankName,
      bankCode,
      bankBranch,
      bankAccountNumber,
      bankAccountName,
      swiftCode,
      companyId,
      tenantId,
    }: any = req.body;

    //check if the company exists with companyId
    const companyExists = await db.company.findUnique({
      where: { id: companyId },
    });
    if (!companyExists) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    //check if the tenant exists with tenantId
    const tenantExists = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenantExists) {
      return res.status(404).json({
        error: "Tenant not found",
      });
    }

    //check if the companyInformation exists with companyId and tenantId
    const companyInformationExists = await db.companyInformation.findUnique({
      where: {
        tenantId_companyId: {
          tenantId: tenantId,
          companyId: companyId,
        },
      },
    });
    if (companyInformationExists) {
      return res.status(409).json({
        error: "Company Information already exists",
      });
    }

    const companyInformation = await db.companyInformation.create({
      data: {
        name,
        address,
        address_2,
        city,
        state,
        zip,
        country,
        contactName,
        phone,
        email,
        website,
        fax,
        taxRegNo,
        logo,
        bankName,
        bankCode,
        bankBranch,
        bankAccountNumber,
        bankAccountName,
        swiftCode,
        companyId,
        companyName: companyExists.name,
        tenantId,
        tenantName: tenantExists.name,
      },
    });

    return res.status(201).json({
      data: companyInformation,
      message: "Company Information created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Company Information:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while creating the Company Information.`,
    });
  }
};

export const getCompanyInformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyInformation = await db.companyInformation.findUnique({
      where: { id },
    });

    if (!companyInformation) {
      return res.status(404).json({
        error: "Company Information not found",
      });
    }

    return res.status(200).json({
      data: companyInformation,
      message: "Company Information fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Company Information:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Company Information.`,
    });
  }
};

export const updateCompanyInformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      address_2,
      city,
      state,
      zip,
      country,
      contactName,
      phone,
      email,
      website,
      fax,
      taxRegNo,
      logo,
      bankName,
      bankCode,
      bankBranch,
      bankAccountNumber,
      bankAccountName,
      swiftCode,
    }: any = req.body;

    //check if the companyInformation exists
    const companyInformationExists = await db.companyInformation.findUnique({
      where: { id },
    });
    if (!companyInformationExists) {
      return res.status(404).json({
        error: "Company Information not found",
      });
    }

    const companyInformation = await db.companyInformation.update({
      where: { id },
      data: {
        name,
        address,
        address_2,
        city,
        state,
        zip,
        country,
        contactName,
        phone,
        email,
        website,
        fax,
        taxRegNo,
        logo,
        bankName,
        bankCode,
        bankBranch,
        bankAccountNumber,
        bankAccountName,
        swiftCode,
      },
    });
    return res.status(200).json({
      data: companyInformation,
      message: "Company Information updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Company Information:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Company Information.`,
    });
  }
};

export const deleteCompanyInformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const companyInformation = await db.companyInformation.findUnique({
      where: { id },
    });
    if (!companyInformation) {
      return res.status(404).json({ error: "Company Information not found." });
    }

    const companyInformationDeleted = await db.companyInformation.delete({
      where: { id },
    });
    return res.status(200).json({
      data: companyInformationDeleted,
      message: "Company Information deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Company Information:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Company Information.`,
    });
  }
};
