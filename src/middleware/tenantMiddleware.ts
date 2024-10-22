import { Request, Response, NextFunction } from "express";
import { TenantContextManager } from "@/utils/tenantContextManager";

const excludedPaths = [
  "/api/v1/tenants",
  "/api/v1/companies",
  "/api/v1/login",
  "/api/v1/users",
];

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the current path should be excluded from tenant middleware
  if (excludedPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  const tenantId = req.headers["x-tenant-id"] as string;
  const companyId = req.headers["x-company-id"] as string;

  if (!tenantId || !companyId) {
    return res
      .status(400)
      .json({ error: "Tenant and Company ID are required" });
  }

  // Check if the tenant and company exist
  const tenantManager = TenantContextManager.getInstance();

  const tenantExists = await tenantManager.tenantExists(tenantId);
  if (!tenantExists) {
    return res.status(404).json({ error: "Tenant not found" });
  }

  const companyExists = await tenantManager.companyExistsUnderTenant(
    tenantId,
    companyId
  );
  if (!companyExists) {
    return res
      .status(404)
      .json({ error: "Company not found under this tenant" });
  }

  await TenantContextManager.getInstance().run(
    { tenantId, companyId },
    async () => {
      next();
    }
  );
};
