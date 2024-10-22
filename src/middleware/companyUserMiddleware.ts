import { Request, Response, NextFunction } from "express";
import { ContextManager } from "@/utils/contextManager";

const excludedPaths = ["/api/v1/tenants", "/api/v1/login"];

export const companyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the current path should be excluded from tenant middleware
  if (excludedPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  const tenantId = req.headers["x-tenant-id"] as string;

  if (!tenantId) {
    console.log("Error here companyUserMiddleware");
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
