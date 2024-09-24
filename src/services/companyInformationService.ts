import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

//create a service to create a companyInformation
const createCompanyInformation = async (
  companyInformation: Prisma.companyInformationCreateInput
) => {
  try {
    const {
      name,
      address,
      address_2,
      city,
      state,
      zip,
      country,
      contactName,
      phone,
      email,
      website,
      fax,
      taxRegNo,
      logo,
      bankName,
      bankCode,
      bankBranch,
      bankAccountNumber,
      bankAccountName,
      swiftCode,
      companyId,
      tenantId,
    } = companyInformation;

    //check if the company exists with companyId
    const companyExists = await db.company.findUnique({
      where: { id: companyId },
    });
    if (!companyExists) {
      throw new Error("Company not found");
    }

    //check if the tenant exists with tenantId
    const tenantExists = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenantExists) {
      throw new Error("Tenant not found");
    }

    const companyInformationExists = await db.companyInformation.findUnique({
      where: {
        tenantId_companyId: {
          tenantId: tenantId,
          companyId: companyId,
        },
      },
    });
    if (companyInformationExists) {
      throw new Error("Company Information already exists");
    }

    const newCompanyInformation = await db.companyInformation.create({
      data: {
        name,
        address,
        address_2,
        city,
        state,
        zip,
        country,
        contactName,
        phone,
        email,
        website,
        fax,
        taxRegNo,
        logo,
        bankName,
        bankCode,
        bankBranch,
        bankAccountNumber,
        bankAccountName,
        swiftCode,
        companyId,
        tenantId,
      },
      include: {
        tenant: true,
        company: true,
      },
    });
    return {
      data: newCompanyInformation,
      message: "Company Information created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Company Information:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

//Get all companyInformation
const getCompanyInformation = async () => {
  try {
    const companyInformation = await db.companyInformation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: companyInformation,
    };
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }
};

//Get a companyInformation by id
const getCompanyInformationById = async (id: string) => {
  try {
    const companyInformation = await db.companyInformation.findUnique({
      where: { id },
      include: {
        tenant: true,
        company: true,
      },
    });

    if (!companyInformation) {
      throw new Error("Company Information not found");
    }

    return {
      data: companyInformation,
      message: "Company Information fetched successfully",
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

//Update a companyInformation
export const updateCompanyInformation = async (
  id: string,
  companyInformation: Prisma.companyInformationCreateInput
) => {
  const {
    name,
    address,
    address_2,
    city,
    state,
    zip,
    country,
    contactName,
    phone,
    email,
    website,
    fax,
    taxRegNo,
    logo,
    bankName,
    bankCode,
    bankBranch,
    bankAccountNumber,
    bankAccountName,
    swiftCode,
  } = companyInformation;

  try {
    //check if the companyInformation exists
    const companyInformationExists = await db.companyInformation.findUnique({
      where: { id },
    });
    if (!companyInformationExists) {
      throw new Error("Company Information not found");
    }

    const companyInformationUpdate = await db.companyInformation.update({
      where: { id },
      data: {
        name,
        address,
        address_2,
        city,
        state,
        zip,
        country,
        contactName,
        phone,
        email,
        website,
        fax,
        taxRegNo,
        logo,
        bankName,
        bankCode,
        bankBranch,
        bankAccountNumber,
        bankAccountName,
        swiftCode,
      },
      include: {
        tenant: true,
        company: true,
      },
    });
    return {
      data: companyInformationUpdate,
      message: "Company Information updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Company Information:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

//create a service to delete a companyInformation
const deleteCompanyInformation = async (id: string) => {
  try {
    // Check if the companyInformation exists
    const companyInformation = await db.companyInformation.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!companyInformation) {
      throw new Error("Company Information not found.");
    }
    // Delete the companyInformation
    const deletedCompanyInformation = await db.companyInformation.delete({
      where: { id },
    });
    return {
      data: deletedCompanyInformation,
      message: `Company Information deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Company Information:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const companyInformationService = {
  createCompanyInformation,
  getCompanyInformationById,
  getCompanyInformation,
  updateCompanyInformation,
  deleteCompanyInformation,
};
