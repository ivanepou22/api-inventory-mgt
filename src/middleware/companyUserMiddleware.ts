import { Request, Response, NextFunction } from "express";
import { ContextManager } from "@/utils/contextManager";

export const companyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = req.headers["x-tenant-id"] as string;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantID is required" });
  }

  // Check if the tenant and company exist
  const tenantManager = ContextManager.getInstance();

  const tenantExists = await tenantManager.tenantExists(tenantId);
  if (!tenantExists) {
    return res.status(404).json({ error: "Tenant not found" });
  }

  await ContextManager.getInstance().run({ tenantId }, async () => {
    next();
  });
};
