import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { TenantManagementService } from "./tenantManagementService";
import { slugify } from "@/utils/functions";

export class CompanyService extends TenantManagementService {
  constructor(db: PrismaClient) {
    super(db);
  }

  createCompany = async (company: Prisma.CompanyUncheckedCreateInput) => {
    const { code, name } = company;
    try {
      const codeUpperCase = await slugify(code);
      //check if the tenant exists
      const tenantId = this.getTenantId();

      const companyCodeExists = await this.findUnique(
        (args) => this.db.company.findUnique(args),
        {
          where: {
            tenantId_code: {
              code: codeUpperCase,
              tenantId,
            },
          },
        }
      );
      if (companyCodeExists) {
        throw new Error("Company code already exists");
      }

      const newCompany = await this.create(
        (args) => this.db.company.create(args),
        {
          data: {
            code: codeUpperCase,
            name,
            tenantId,
          },
          include: {
            tenant: true,
          },
        }
      );

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
  getCompanies = async () => {
    try {
      const companies = await this.findMany(
        (args) => this.db.company.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            tenant: true,
          },
        }
      );

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
  getCompany = async (id: string) => {
    try {
      const company = await this.findUnique(
        (args) => this.db.company.findUnique(args),
        {
          where: {
            id,
          },
          include: {
            tenant: true,
          },
        }
      );

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
  updateCompany = async (id: string, company: Prisma.CompanyCreateInput) => {
    const { name, code } = company;
    try {
      const companyExists = await this.db.company.findUnique({
        where: { id },
        select: { id: true, name: true, code: true, tenantId: true },
      });
      if (!companyExists) {
        throw new Error("Company not found.");
      }

      let codeUpperCase = code ? await slugify(code) : companyExists.code;

      if (codeUpperCase && codeUpperCase !== companyExists.code) {
        const companyCodeExists = await this.findUnique(
          (args) => this.db.company.findUnique(args),
          {
            where: {
              tenantId_code: {
                code: codeUpperCase,
                tenantId: companyExists.tenantId,
              },
            },
          }
        );
        if (companyCodeExists) {
          throw new Error("Company code already exists");
        }
      }

      // Perform the update
      const updatedCompany = await this.update(
        (args) => this.db.company.update(args),
        {
          where: { id },
          data: { name, code: codeUpperCase },
        }
      );
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

  // Delete a company
  deleteCompany = async (id: string) => {
    try {
      // Check if the company exists
      const company = await this.findUnique(
        (args) => this.db.company.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!company) {
        throw new Error("Company not found.");
      }
      // Delete the company
      const deletedCompany = await this.delete(
        (args) => this.db.company.delete(args),
        {
          where: { id },
        }
      );
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

export const companyService = (): CompanyService => {
  return new CompanyService(db);
};
