import { Router } from "express";
import {
  createCompanyInformation,
  getCompanyInformation,
  updateCompanyInformation,
  deleteCompanyInformation,
} from "@/controllers/companyInformationController";

const companyInformationRouter = Router();

companyInformationRouter.post("/companyInformation", createCompanyInformation);
companyInformationRouter.get("/companyInformation", getCompanyInformation);
companyInformationRouter.put(
  "/companyInformation/:id",
  updateCompanyInformation
);
companyInformationRouter.delete(
  "/companyInformation/:id",
  deleteCompanyInformation
);

export default companyInformationRouter;
