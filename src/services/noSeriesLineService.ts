import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createNoSeriesLine = async (
  noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput
) => {
  const {
    noSeriesId,
    startingDate,
    endingDate,
    startingNo,
    endingNo,
    lastDateUsed,
    lastNoUsed,
    lastDigitUsed,
    increment,
  } = noSeriesLine;
  try {
    //get the noSeries
    const noSeries = await db.noSeries.findUnique({
      where: { id: noSeriesId },
    });
    if (!noSeries) {
      throw new Error("No Series not found");
    }
    const noSeriesCode = noSeries.code;

    //the start date should always be less than the ending date and the ending date should be greater than the starting date
    if (startingDate && endingDate) {
      if (startingDate > endingDate) {
        throw new Error(
          "The starting date should be less than the ending date."
        );
      }
      if (endingDate < startingDate) {
        throw new Error(
          "The ending date should be greater than the starting date."
        );
      }
    }
    const noSeriesLine = await db.noSeriesLine.create({
      data: {
        noSeriesId,
        noSeriesCode,
        startingDate,
        endingDate,
        startingNo,
        endingNo,
        lastDateUsed,
        lastNoUsed,
        lastDigitUsed,
        increment,
      },
    });

    return {
      data: noSeriesLine,
      message: "No Series Line created successfully",
    };
  } catch (error: any) {
    console.error("Error creating No Series Line:", error);
    throw new Error("Failed to create No Series Line");
  }
};

const getNoSeriesLines = async () => {
  try {
    const noSeriesLines = await db.noSeriesLine.findMany();
    return {
      data: noSeriesLines,
      message: "No Series Lines fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching No Series Lines:", error);
    throw new Error("Failed to fetch No Series Lines");
  }
};

const getNoSeriesLine = async (id: string) => {
  try {
    const noSeriesLine = await db.noSeriesLine.findUnique({
      where: { id },
    });

    if (!noSeriesLine) {
      throw new Error("No Series Line not found");
    }

    return {
      data: noSeriesLine,
      message: "No Series Line fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching No Series Line:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateNoSeriesLine = async (
  id: string,
  noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput
) => {
  const {
    startingDate,
    endingDate,
    startingNo,
    endingNo,
    lastDateUsed,
    lastNoUsed,
    lastDigitUsed,
    increment,
  } = noSeriesLine;
  try {
    //check if the noSeriesLine exists
    const noSeriesLineExists = await db.noSeriesLine.findUnique({
      where: { id },
    });
    if (!noSeriesLineExists) {
      throw new Error("No Series Line not found");
    }

    if (startingDate && endingDate) {
      if (startingDate > endingDate) {
        throw new Error(
          "The starting date should be less than the ending date."
        );
      }
      if (endingDate < startingDate) {
        throw new Error(
          "The ending date should be greater than the starting date."
        );
      }
    } else if (startingDate) {
      if (noSeriesLineExists.endingDate) {
        if (startingDate > noSeriesLineExists.endingDate) {
          throw new Error(
            "The starting date should be less than the ending date."
          );
        }
        if (noSeriesLineExists.endingDate < startingDate) {
          throw new Error(
            "The ending date should be greater than the starting date."
          );
        }
      }
    } else if (endingDate && noSeriesLineExists.startingDate) {
      if (endingDate < noSeriesLineExists.startingDate) {
        throw new Error(
          "The ending date should be greater than the starting date."
        );
      }
    }

    const noSeriesLine = await db.noSeriesLine.update({
      where: { id },
      data: {
        startingDate,
        endingDate,
        startingNo,
        endingNo,
        lastDateUsed,
        lastNoUsed,
        lastDigitUsed,
        increment,
      },
    });
    return {
      data: noSeriesLine,
      message: "No Series Line updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating No Series Line:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteNoSeriesLine = async (id: string) => {
  try {
    const noSeriesLine = await db.noSeriesLine.findUnique({
      where: { id },
    });
    if (!noSeriesLine) {
      throw new Error("No Series Line not found.");
    }

    const noSeriesLineDeleted = await db.noSeriesLine.delete({
      where: { id },
    });
    return {
      data: noSeriesLineDeleted,
      message: "No Series Line deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting No Series Line:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const noSeriesLineService = {
  createNoSeriesLine,
  getNoSeriesLines,
  getNoSeriesLine,
  updateNoSeriesLine,
  deleteNoSeriesLine,
};
