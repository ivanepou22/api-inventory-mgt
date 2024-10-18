import { Request, Response, NextFunction } from "express";
import { TenantContextManager } from "@/utils/tenantContextManager";

const excludedPaths = ["/api/v1/tenants", "/api/v1/companies", "/api/v1/login"];

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

  await TenantContextManager.getInstance().run(
    { tenantId, companyId },
    async () => {
      next();
    }
  );
};
