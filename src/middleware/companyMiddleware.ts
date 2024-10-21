import { Response, NextFunction } from "express";
import { TenantContextManager } from "@/utils/tenantContextManager";
import { RequestWithTenant } from "@/utils/types";

export const companyMiddleware = async (
  req: RequestWithTenant,
  res: Response,
  next: NextFunction
) => {
  const tenantId = req.headers.get("x-tenant-id");

  if (!tenantId || Array.isArray(tenantId)) {
    return res
      .status(400)
      .json({ error: "Tenant ID is required and must be a string" });
  }

  const tenantManager = TenantContextManager.getInstance();

  const tenantExists = await tenantManager.tenantExists(tenantId);
  if (!tenantExists) {
    return res.status(404).json({ error: "Tenant not found" });
  }

  // Store tenantId in request object for later use
  req.tenantId = tenantId;

  next();
};
