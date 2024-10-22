import { Router } from "express";
import { companyUserMiddleware } from "@/middleware/companyUserMiddleware";
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "@/controllers/companyController";

const companyRouter = Router();

companyRouter.post("/companies", companyUserMiddleware, createCompany);
companyRouter.get("/companies", companyUserMiddleware, getCompanies);
companyRouter.get("/companies/:id", companyUserMiddleware, getCompany);
companyRouter.put("/companies/:id", companyUserMiddleware, updateCompany);
companyRouter.delete("/companies/:id", companyUserMiddleware, deleteCompany);

export default companyRouter;
