import { Router } from "express";
import {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant,
} from "@/controllers/tenantController";

const tenantRouter = Router();

tenantRouter.post("/tenants", createTenant);
tenantRouter.get("/tenants", getTenants);
tenantRouter.get("/tenants/:id", getTenant);
tenantRouter.put("/tenants/:id", updateTenant);
tenantRouter.delete("/tenants/:id", deleteTenant);

export default tenantRouter;
