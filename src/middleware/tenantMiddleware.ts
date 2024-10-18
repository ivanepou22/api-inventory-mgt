import { Request, Response, NextFunction } from "express";
import { TenantContextManager } from "@/utils/tenantContextManager";

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
