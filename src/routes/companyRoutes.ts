import { Router } from "express";
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "@/controllers/companyController";

const companyRouter = Router();

companyRouter.post("/companies", createCompany);
companyRouter.get("/companies", getCompanies);
companyRouter.get("/companies/:id", getCompany);
companyRouter.put("/companies/:id", updateCompany);
companyRouter.delete("/companies/:id", deleteCompany);

export default companyRouter;
