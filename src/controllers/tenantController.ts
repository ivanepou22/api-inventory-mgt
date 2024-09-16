import { Request, Response } from "express";
import { db } from "@/db/db";

export const createTenant = async (req: Request, res: Response) => {
  try {
    const { name }: any = req.body;

    const tenant = await db.tenant.create({
      data: {
        name,
      },
    });
    return res.status(201).json({
      data: tenant,
      message: "Tenant created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Tenant:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while creating the Tenant.`,
    });
  }
};

export const getTenants = async (_req: Request, res: Response) => {
  try {
    const tenants = await db.tenant.findMany();
    return res.status(200).json({
      data: tenants,
      message: "Tenants fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Tenants:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching Tenants.",
    });
  }
};

export const getTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await db.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      return res.status(404).json({
        error: "Tenant not found",
      });
    }

    return res.status(200).json({
      data: tenant,
      message: "Tenant fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Tenant:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Tenant.`,
    });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name }: any = req.body;

    //check if the tenant exists
    const tenantExists = await db.tenant.findUnique({
      where: { id },
    });
    if (!tenantExists) {
      return res.status(404).json({
        error: "Tenant not found",
      });
    }

    const tenant = await db.tenant.update({
      where: { id },
      data: { name },
    });
    return res.status(200).json({
      data: tenant,
      message: "Tenant updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Tenant:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Tenant.`,
    });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tenant = await db.tenant.findUnique({
      where: { id },
    });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    const tenantDeleted = await db.tenant.delete({
      where: { id },
    });
    return res.status(200).json({
      data: tenantDeleted,
      message: "Tenant deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Tenant:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Tenant.`,
    });
  }
};
