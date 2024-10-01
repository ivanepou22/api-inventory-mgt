import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createOnlineOrderSetup = async (
  onlineOrderSetup: Prisma.OnlineOrderSetupUncheckedCreateInput
) => {
  const { customerId, tenantId, companyId } = onlineOrderSetup;

  try {
    const customer = await db.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new Error("Customer not found.");
    }

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new Error("Company not found.");
    }

    const newOnlineOrderSetup = await db.onlineOrderSetup.create({
      data: {
        customerId,
        tenantId,
        companyId,
      },
      include: {
        customer: true,
        tenant: true,
        company: true,
      },
    });
    return {
      data: newOnlineOrderSetup,
      message: "Online Order Setup created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Online Order Setup:", error);
    throw new Error(error.message);
  }
};

const getOnlineOrderSetups = async () => {
  try {
    const onlineOrderSetups = await db.onlineOrderSetup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        tenant: true,
        company: true,
      },
    });
    return {
      data: onlineOrderSetups,
      message: "Online Order Setups fetched successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

const getOnlineOrderSetup = async (id: string) => {
  try {
    const onlineOrderSetup = await db.onlineOrderSetup.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        tenant: true,
        company: true,
      },
    });
    if (!onlineOrderSetup) {
      throw new Error("Online Order Setup not found");
    }
    return {
      data: onlineOrderSetup,
      message: "Online Order Setup fetched successfully",
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

const updateOnlineOrderSetup = async (
  id: string,
  onlineOrderSetup: Prisma.OnlineOrderSetupUncheckedCreateInput
) => {
  const { customerId } = onlineOrderSetup;

  try {
    const onlineOrderSetupExists = await db.onlineOrderSetup.findUnique({
      where: { id },
    });
    if (!onlineOrderSetupExists) {
      throw new Error("Online Order Setup not found.");
    }

    const customer = await db.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new Error("Customer not found.");
    }

    // Perform the update
    const updatedOnlineOrderSetup = await db.onlineOrderSetup.update({
      where: { id },
      data: {
        customerId,
      },
    });
    return {
      data: updatedOnlineOrderSetup,
      message: "Online Order Setup updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Online Order Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

//delete
const deleteOnlineOrderSetup = async (id: string) => {
  try {
    // Check if the onlineOrderSetup exists
    const onlineOrderSetup = await db.onlineOrderSetup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!onlineOrderSetup) {
      throw new Error("Online Order Setup not found.");
    }
    // Delete the onlineOrderSetup
    const deletedOnlineOrderSetup = await db.onlineOrderSetup.delete({
      where: { id },
    });
    return {
      data: deletedOnlineOrderSetup,
      message: `Online Order Setup deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Online Order Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const onlineOrderSetupService = {
  createOnlineOrderSetup,
  getOnlineOrderSetups,
  getOnlineOrderSetup,
  updateOnlineOrderSetup,
  deleteOnlineOrderSetup,
};
