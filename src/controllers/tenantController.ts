import { Request, Response } from "express";
import { tenantService } from "@/services/tenantService";

export const createTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.createTenant(req.body);
    return res.status(201).json(tenant);
  } catch (error: any) {
    console.error("Error creating Tenant:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getTenants = async (_req: Request, res: Response) => {
  try {
    const tenants = await tenantService.getTenants();
    return res.status(200).json(tenants);
  } catch (error: any) {
    console.error("Error fetching Tenants:", error);
    return res.status(500).json({
      error: `Failed to fetch Tenants: ${error.message}`,
    });
  }
};

export const getTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.getTenant(req.params.id);
    return res.status(200).json(tenant);
  } catch (error: any) {
    console.error("Error fetching Tenant:", error);
    return res.status(500).json({
      error: `Failed to fetch Tenant: ${error.message}`,
    });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.body);
    return res.status(200).json(tenant);
  } catch (error: any) {
    console.error("Error updating Tenant:", error);
    return res.status(500).json({
      error: `Failed to update Tenant: ${error.message}`,
    });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await tenantService.deleteTenant(req.params.id);
    return res.status(200).json(tenant);
  } catch (error: any) {
    console.error("Error deleting Tenant:", error);
    return res.status(500).json({
      error: `Failed to delete Tenant: ${error.message}`,
    });
  }
};
