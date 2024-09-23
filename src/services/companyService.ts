import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

export const createCompany = async (company: Prisma.CompanyCreateInput) => {
  const { code, name, tenantId } = company;
  //check if the tenant exists
  const tenantExists = await db.tenant.findUnique({
    where: { id: tenantId },
  });
  if (!tenantExists) {
    throw new Error("Tenant not found");
  }

  const companyCodeExists = await db.company.findUnique({
    where: {
      tenantId_code: {
        code,
        tenantId,
      },
    },
  });
  if (companyCodeExists) {
    throw new Error("Company code already exists");
  }

  try {
    const newCompany = await db.company.create({
      data: {
        code,
        name,
        tenantId,
        tenantName: tenantExists.name,
      },
    });
    return {
      data: newCompany,
      message: "Company created successfully",
    };
  } catch (error) {
    console.error("Error creating Company:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//Get all companies
export const getCompanies = async () => {
  try {
    const companies = await db.company.findMany({
      orderBy: {
        createdAt: "desc",
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
export const getCompany = async (id: string) => {
  try {
    const company = await db.company.findUnique({
      where: {
        id,
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
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

//Update a company
export const updateCompany = async (
  id: string,
  company: Prisma.CompanyCreateInput
) => {
  const { name, code } = company;
  try {
    const companyExists = await db.company.findUnique({
      where: { id },
      select: { id: true, name: true, code: true, tenantId: true },
    });
    if (!companyExists) {
      throw new Error("Company not found.");
    }
    if (code && code !== companyExists.code) {
      const companyCodeExists = await db.company.findUnique({
        where: {
          tenantId_code: {
            code,
            tenantId: companyExists.tenantId,
          },
        },
      });
      if (companyCodeExists) {
        throw new Error("Company code already exists");
      }
    }
    // Perform the update
    const updatedCompany = await db.company.update({
      where: { id },
      data: { name, code },
    });
    return { data: updatedCompany, message: "Company updated successfully" };
  } catch (error: any) {
    console.error("Error updating Company:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//create a service to delete a company
export const deleteCompany = async (id: string) => {
  try {
    // Check if the company exists
    const company = await db.company.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!company) {
      throw new Error("Company not found.");
    }
    // Delete the company
    const deletedCompany = await db.company.delete({
      where: { id },
    });
    return {
      data: deletedCompany,
      message: `Company deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Company:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const companyService = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
