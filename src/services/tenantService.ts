import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createTenant = async (tenant: Prisma.TenantCreateInput) => {
  const { name }: any = tenant;
  try {
    const tenant = await db.tenant.create({
      data: {
        name,
      },
    });
    return {
      data: tenant,
      message: "Tenant created successfully",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const getTenants = async () => {
  try {
    const tenants = await db.tenant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: tenants,
      message: "Tenants fetched successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting tenants.");
  }
};

const getTenant = async (id: string) => {
  try {
    const tenant = await db.tenant.findUnique({
      where: {
        id,
      },
    });
    if (!tenant) {
      throw new Error("Tenant not found.");
    }
    return {
      data: tenant,
      message: "Tenant fetched successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateTenant = async (
  id: string,
  tenant: Prisma.TenantUncheckedUpdateInput
) => {
  const { name } = tenant;
  try {
    const tenantExists = await db.tenant.findUnique({
      where: { id },
    });
    if (!tenantExists) {
      throw new Error("Tenant not found.");
    }
    // Perform the update
    const updatedTenant = await db.tenant.update({
      where: { id },
      data: {
        name,
      },
    });
    return {
      data: updatedTenant,
      message: "Tenant updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteTenant = async (id: string) => {
  try {
    // Check if the brand exists
    const tenant = await db.tenant.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!tenant) {
      throw new Error("Tenant not found.");
    }
    // Delete the brand
    const deletedTenant = await db.tenant.delete({
      where: { id },
    });
    return {
      data: deletedTenant,
      message: `Tenant deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const tenantService = {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant,
};
