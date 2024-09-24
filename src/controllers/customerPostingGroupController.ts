import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";

export const createCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  const { code, name, receivableAccount } = req.body;

  //make name uppercase
  const nameUppercase = name.toUpperCase();
  const codeUppercase = await slugify(code);

  const customerPostingGroupExists = await db.customerPostingGroup.findUnique({
    where: {
      code: codeUppercase,
    },
  });
  if (customerPostingGroupExists) {
    return res.status(409).json({
      error: `Customer Posting Group with code: ${code} already exists`,
    });
  }
  try {
    const newCustomerPostingGroup = await db.customerPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        receivableAccount,
      },
    });
    return res.status(201).json({
      data: newCustomerPostingGroup,
      message: "Customer Posting Group created successfully",
    });
  } catch (error) {
    console.error("Error creating Customer Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getCustomerPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const customerPostingGroups = await db.customerPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: customerPostingGroups,
      message: "Customer Posting Groups retrieved successfully",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getCustomerPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customerPostingGroup = await db.customerPostingGroup.findUnique({
      where: {
        id,
      },
    });
    if (!customerPostingGroup) {
      return res.status(404).json({
        error: `Customer Posting Group not found.`,
      });
    }
    return res.status(200).json({
      data: customerPostingGroup,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { code, name, receivableAccount } = req.body;

  try {
    const customerPostingGroupExists = await db.customerPostingGroup.findUnique(
      {
        where: { id },
        select: { id: true, code: true, name: true, receivableAccount: true },
      }
    );
    if (!customerPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "Customer Posting Group not found." });
    }

    const nameUppercase = name
      ? name.toUpperCase()
      : customerPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : customerPostingGroupExists.code;

    // Check if the code already exists
    if (codeUppercase && codeUppercase !== customerPostingGroupExists.code) {
      const customerPostingGroupCodeExists =
        await db.customerPostingGroup.findUnique({
          where: {
            code: codeUppercase,
          },
        });
      if (customerPostingGroupCodeExists) {
        return res.status(409).json({
          error: `Customer Posting Group with code: ${codeUppercase} already exists`,
        });
      }
    }

    // Perform the update
    const updatedCustomerPostingGroup = await db.customerPostingGroup.update({
      where: { id },
      data: { code: codeUppercase, name: nameUppercase, receivableAccount },
    });
    return res.status(200).json({
      data: updatedCustomerPostingGroup,
      message: "Customer Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Customer Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    // Check if the customerPostingGroup exists
    const customerPostingGroup = await db.customerPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!customerPostingGroup) {
      return res
        .status(404)
        .json({ error: "Customer Posting Group not found." });
    }
    // Delete the customerPostingGroup
    const deletedCustomerPostingGroup = await db.customerPostingGroup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedCustomerPostingGroup,
      message: `Customer Posting Group deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Customer Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
