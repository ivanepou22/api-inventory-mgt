import { db } from "@/db/db";
import { Request, Response } from "express";

export const createPayee = async (req: Request, res: Response) => {
  const { name, phone, email } = req.body;

  const payeeExists = await db.payee.findUnique({
    where: {
      phone,
    },
  });
  if (payeeExists) {
    return res.status(409).json({
      error: `Payee with phone: ${phone} already exists`,
    });
  }

  try {
    const newPayee = await db.payee.create({
      data: {
        name,
        phone,
        email,
      },
    });

    return res.status(201).json({
      data: newPayee,
      error: null,
      message: "Payee created successfully",
    });
  } catch (error) {
    console.error("Error creating Payee:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getPayees = async (_req: Request, res: Response) => {
  try {
    const payees = await db.payee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: payees,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getPayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const payee = await db.payee.findUnique({
      where: {
        id,
      },
    });
    if (!payee) {
      return res.status(404).json({
        data: null,
        error: `Payee not found.`,
      });
    }
    return res.status(200).json({
      data: payee,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updatePayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, phone, email } = req.body;

  try {
    const payeeExists = await db.payee.findUnique({
      where: { id },
      select: { id: true, name: true, phone: true, email: true },
    });

    if (!payeeExists) {
      return res.status(404).json({ error: "Payee not found." });
    }

    if (phone && phone !== payeeExists.phone) {
      const payeeByPhone = await db.payee.findUnique({
        where: {
          phone,
        },
      });
      if (payeeByPhone) {
        return res.status(409).json({
          error: `Payee with phone: ${phone} already exists`,
        });
      }
    }
    // Perform the update
    const updatedPayee = await db.payee.update({
      where: { id },
      data: { name, phone, email },
    });

    return res.status(200).json({
      data: updatedPayee,
      message: "Payee updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Payee:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deletePayee = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the payee exists
    const payee = await db.payee.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!payee) {
      return res.status(404).json({ error: "Payee not found." });
    }
    // Delete the payee
    const deletedPayee = await db.payee.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedPayee,
      message: `Payee deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Payee:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
