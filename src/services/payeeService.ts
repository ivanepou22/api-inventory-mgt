import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

export const createPayee = async (payee: Prisma.PayeeUncheckedCreateInput) => {
  const { name, phone, email } = payee;
  try {
    const payeeExists = await db.payee.findUnique({
      where: {
        phone,
      },
    });
    if (payeeExists) {
      throw new Error(`Payee with phone: ${phone} already exists`);
    }

    const newPayee = await db.payee.create({
      data: {
        name,
        phone,
        email,
      },
    });

    return {
      data: newPayee,
      message: "Payee created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Payee:", error);
    throw new Error(error.message);
  }
};

export const getPayees = async () => {
  try {
    const payees = await db.payee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: payees,
      message: "Payees fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Payees:", error);
    throw new Error(error.message);
  }
};

export const getPayee = async (id: string) => {
  try {
    const payee = await db.payee.findUnique({
      where: {
        id,
      },
    });
    if (!payee) {
      throw new Error("Payee not found");
    }
    return {
      data: payee,
      message: "Payee fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Payee:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const updatePayee = async (
  id: string,
  payee: Prisma.PayeeUncheckedCreateInput
) => {
  const { name, phone, email } = payee;
  try {
    const payeeExists = await db.payee.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    });
    if (!payeeExists) {
      throw new Error("Payee not found");
    }

    if (phone && phone !== payeeExists.phone) {
      const payeeByPhone = await db.payee.findUnique({
        where: {
          phone,
        },
      });
      if (payeeByPhone) {
        throw new Error(`Payee with phone: ${phone} already exists`);
      }
    }
    // Perform the update
    const updatedPayee = await db.payee.update({
      where: { id },
      data: {
        name,
        phone,
        email,
      },
    });
    return {
      data: updatedPayee,
      message: "Payee updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Payee:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const deletePayee = async (id: string) => {
  try {
    // Check if the payee exists
    const payee = await db.payee.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!payee) {
      throw new Error("Payee not found");
    }
    // Delete the payee
    const deletedPayee = await db.payee.delete({
      where: { id },
    });
    return {
      data: deletedPayee,
      message: "Payee deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Payee:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const payeeService = {
  createPayee,
  getPayees,
  getPayee,
  updatePayee,
  deletePayee,
};
