import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { slugify } from "@/utils/functions";

export class CompanyService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  createCompany = async (
    company: Prisma.CompanyUncheckedCreateInput,
    tenantId: string
  ) => {
    const { code, name } = company;
    try {
      const codeUpperCase = await slugify(code);
      //check if the tenant exists
      const tenantExists = await this.db.tenant.findUnique({
        where: {
          id: tenantId,
        },
      });
      if (!tenantExists) {
        throw new Error("Tenant does not exist");
      }
      //check if the tenant exists
      const companyCodeExists = await this.db.company.findUnique({
        where: {
          tenantId_code: {
            code: codeUpperCase,
            tenantId,
          },
        },
      });
      if (companyCodeExists) {
        throw new Error("Company code already exists");
      }

      const newCompany = await this.db.company.create({
        data: {
          code: codeUpperCase,
          name,
          tenantId,
        },
        include: {
          tenant: true,
        },
      });
      return {
        data: newCompany,
        message: "Company created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Company:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //Get all companies
  getCompanies = async (tenantId: string) => {
    try {
      const companies = await this.db.company.findMany({
        where: {
          tenantId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tenant: true,
        },
      });
      return {
        data: companies,
        message: "Companies fetched successfully",
      };
    } catch (err: any) {
      console.log(err.message);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  };

  //Get a company by id
  getCompany = async (id: string, tenantId: string) => {
    try {
      const company = await this.db.company.findUnique({
        where: {
          id,
          tenantId,
        },
        include: {
          tenant: true,
        },
      });
      if (!company) {
        throw new Error("Company not found.");
      }

      return {
        data: company,
        message: "Company fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //Update a company
  updateCompany = async (
    id: string,
    company: Prisma.CompanyCreateInput,
    tenantId: string
  ) => {
    const { code, name } = company;
    try {
      const companyExists = await this.db.company.findUnique({
        where: { id, tenantId },
        select: { id: true, name: true, code: true, tenantId: true },
      });
      if (!companyExists) {
        throw new Error("Company not found.");
      }

      let codeUpperCase = code ? await slugify(code) : null;

      if (codeUpperCase && codeUpperCase !== companyExists.code) {
        const companyCodeExists = await this.db.company.findUnique({
          where: {
            tenantId_code: {
              code: codeUpperCase,
              tenantId: companyExists.tenantId,
            },
          },
        });
        if (companyCodeExists) {
          throw new Error("Company code already exists");
        }
      }
      // Perform the update
      const updatedCompany = await this.db.company.update({
        where: { id, tenantId },
        data: { name, code },
      });
      return { data: updatedCompany, message: "Company updated successfully" };
    } catch (error: any) {
      console.error("Error updating Company:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //create a service to delete a company
  deleteCompany = async (id: string, tenantId: string) => {
    try {
      // Check if the company exists
      const company = await this.db.company.findUnique({
        where: { id, tenantId },
        select: { id: true },
      });
      if (!company) {
        throw new Error("Company not found.");
      }
      // Delete the company
      const deletedCompany = await this.db.company.delete({
        where: { id, tenantId },
      });
      return {
        data: deletedCompany,
        message: `Company deleted successfully`,
      };
    } catch (error: any) {
      console.error("Error deleting Company:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };
}
export const createCompanyService = (): CompanyService => {
  return new CompanyService(db);
};
