import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode, slugify } from "@/utils/functions";

export const createVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  const { code, name } = req.body;

  //name should be uppercase
  const nameUppercase = name.toUpperCase();
  const codeUppercase = await slugify(code);

  // Check if the code already exists
  const vatProductPostingGroupCodeExists =
    await db.vatProductPostingGroup.findUnique({
      where: {
        code: codeUppercase,
      },
    });
  if (vatProductPostingGroupCodeExists) {
    return res.status(409).json({
      error: `Vat Product Posting Group with code: ${codeUppercase} already exists`,
    });
  }

  try {
    const vatProductPostingGroup = await db.vatProductPostingGroup.create({
      data: {
        name: nameUppercase,
        code: codeUppercase,
      },
    });

    return res.status(201).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVatProductPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const vatProductPostingGroups = await db.vatProductPostingGroup.findMany();
    return res.status(200).json({
      data: vatProductPostingGroups,
      message: "Vat Product Posting Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Vat Product Posting Groups.",
    });
  }
};

export const getVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
    });

    if (!vatProductPostingGroup) {
      return res.status(404).json({
        error: "Vat Product Posting Group not found",
      });
    }

    return res.status(200).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Vat Product Posting Group: ${error.message}`,
    });
  }
};

//getVatProductPostingGroupByCode
export const getVatProductPostingGroupByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.params;
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: {
        code,
      },
    });

    if (!vatProductPostingGroup) {
      return res.status(404).json({
        error: "Vat Product Posting Group not found",
      });
    }

    return res.status(200).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Vat Product Posting Group.`,
    });
  }
};

export const updateVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { code, name }: any = req.body;

    //check if the vatProductPostingGroup exists
    const vatProductPostingGroupExists =
      await db.vatProductPostingGroup.findUnique({
        where: { id },
      });
    if (!vatProductPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "Vat Product Posting Group not found." });
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : vatProductPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : vatProductPostingGroupExists.code;

    // Check if the code already exists
    if (codeUppercase && codeUppercase !== vatProductPostingGroupExists.code) {
      const vatProdPostingGroupCodeExists =
        await db.vatProductPostingGroup.findUnique({
          where: {
            code: codeUppercase,
          },
        });
      if (vatProdPostingGroupCodeExists) {
        return res.status(409).json({
          error: `Vat Product Posting Group with code: ${codeUppercase} already exists`,
        });
      }
    }

    // Perform the update
    const vatProductPostingGroup = await db.vatProductPostingGroup.update({
      where: { id },
      data: { name: nameUppercase, code: codeUppercase },
    });
    return res.status(200).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const deleteVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
    });
    if (!vatProductPostingGroup) {
      return res
        .status(404)
        .json({ error: "Vat Product Posting Group not found." });
    }

    const vatProductPostingGroupDeleted =
      await db.vatProductPostingGroup.delete({
        where: { id },
      });
    return res.status(200).json({
      data: vatProductPostingGroupDeleted,
      message: "Vat Product Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Vat Product Posting Group: ${error.message}`,
    });
  }
};
