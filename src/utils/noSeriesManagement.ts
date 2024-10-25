import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

type NoSeriesField = "customerNos" | "vendorNos" | "bankAccountNos";
const incrementString = async (str: string): Promise<string> => {
  // Regex to match the non-digit prefix and the numeric part
  const match = str.match(/([^\d]*)(\d+)(.*)/);

  if (match) {
    const prefix = match[1]; // Non-digit prefix
    let num = parseInt(match[2], 10); // Numeric part
    const suffix = match[3]; // Suffix (if any)

    // Increment the number
    num++;

    // Create the new numeric string with leading zeros preserved
    const newNum = num.toString().padStart(match[2].length, "0");

    // Return the new string
    return `${prefix}${newNum}${suffix}`;
  }

  return str; // Return unchanged if format is not recognized
};

// function to get information from the noSeriesSetup table
const getNoSeriesSetup = async (tenantId: string, companyId: string) => {
  const noSeriesSetup = await db.noSeriesSetup.findFirst({
    where: {
      tenantId,
      companyId,
    },
  });

  if (!noSeriesSetup) {
    throw new Error("NoSeriesSetup not found");
  }

  return noSeriesSetup;
};

//get the noSeries from the table
const getNoSeries = async (
  tenantId: string,
  companyId: string,
  noSeriesId: string
) => {
  try {
    const noSeries = await db.noSeries.findUnique({
      where: {
        id: noSeriesId,
        tenantId,
        companyId,
      },
    });
    if (!noSeries) {
      throw new Error("NoSeries not found");
    }
    return noSeries.id;
  } catch (error: any) {
    console.error("Error getting noSeries:", error);
    throw new Error("Unexpected error occurred. Please try again later.");
  }
};

//get the noSeriesLine from the table
const getNoSeriesLine = async (
  tenantId: string,
  companyId: string,
  noSeriesId: string
) => {
  try {
    const noSeriesLine = await db.noSeriesLine.findMany({
      where: {
        noSeriesId,
        tenantId,
        companyId,
      },
    });
    if (!noSeriesLine) {
      throw new Error("NoSeriesLine not found");
    }

    // if the noSeriesLine is one then return it ,
    if (noSeriesLine.length === 1) {
      return noSeriesLine[0];
    }
    // Sort the noSeriesLine by startingDate
    noSeriesLine.sort((a: any, b: any) => a.startingDate - b.startingDate);
    // find the noSeriesLine with the oldest startingDate but less or  equal to the current date
    const noSeriesLineToReturn = noSeriesLine.find(
      (noSeriesLine: any) =>
        noSeriesLine.startingDate <= new Date().toISOString()
    );
    return noSeriesLineToReturn;
  } catch (error: any) {
    console.error("Error getting noSeriesLine:", error);
    throw new Error("Unexpected error occurred. Please try again later.");
  }
};

//function to get the next noSeriesLine from the table
const getNextNoSeriesLine = async (
  noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput
) => {
  try {
    //check if the noSeriesLine has startingNo
    if (!noSeriesLine.startingNo) {
      throw new Error("No startingNo found");
    }
    if (noSeriesLine.lastNoUsed) {
      //increment the lastDateUsed
      const incrementedLastDateUsed = await incrementString(
        noSeriesLine.lastNoUsed
      );
      //check if the incrementedLastDateUsed is less than the startingNo
      if (incrementedLastDateUsed < noSeriesLine.startingNo) {
        //return the incrementedLastDateUsed
        return incrementedLastDateUsed;
      }
    } else {
      //return the startingNo
      return noSeriesLine.startingNo;
    }
  } catch (error: any) {
    console.error("Error getting next noSeriesLine:", error);
    throw new Error("Unexpected error occurred. Please try again later.");
  }
};

//get series
const getSeriesNo = async (
  tenantId: string,
  companyId: string,
  field: NoSeriesField
) => {
  try {
    const noSeriesSetup = await getNoSeriesSetup(tenantId, companyId);
    return noSeriesSetup[field];
  } catch (error: any) {
    console.error("Error getting No. series:", error);
    throw new Error(error.message);
  }
};

//set noSeries
export const setNoSeries = async (
  tenantId: string,
  companyId: string,
  field: NoSeriesField
) => {
  try {
    const SeriesNo = await getSeriesNo(tenantId, companyId, field);
    if (!SeriesNo) {
      throw new Error(`${field} noSeries No. not Setup`);
    }
    const noSeries = await getNoSeries(tenantId, companyId, SeriesNo);
    if (!noSeries) {
      throw new Error("NoSeries not found");
    }
    const noSeriesLine = await getNoSeriesLine(tenantId, companyId, noSeries);
    if (!noSeriesLine) {
      throw new Error("NoSeriesLine not found");
    }
    const nextNoSeriesLine = await getNextNoSeriesLine(noSeriesLine);
    if (!nextNoSeriesLine) {
      throw new Error("NextNoSeriesLine not found");
    }
    return nextNoSeriesLine;
  } catch (error: any) {
    console.error("Error setting noSeries:", error);
    throw new Error(error.message);
  }
};

//set noSeries
export const updateNoSeries = async (
  tenantId: string,
  companyId: string,
  field: NoSeriesField
) => {
  try {
    const SeriesNo = await getSeriesNo(tenantId, companyId, field);
    if (!SeriesNo) {
      throw new Error(`${field} noSeries No. not Setup`);
    }
    const noSeries = await getNoSeries(tenantId, companyId, SeriesNo);
    if (!noSeries) {
      throw new Error("NoSeries not found");
    }
    const noSeriesLine = await getNoSeriesLine(tenantId, companyId, noSeries);
    if (!noSeriesLine) {
      throw new Error("NoSeriesLine not found");
    }
    const nextNoSeriesLine = await getNextNoSeriesLine(noSeriesLine);
    if (!nextNoSeriesLine) {
      throw new Error("NextNoSeriesLine not found");
    }

    const updatedNoSeriesLine = await updateNoSeriesLine(
      noSeriesLine,
      nextNoSeriesLine
    );
    if (!updatedNoSeriesLine) {
      throw new Error("UpdatedNoSeriesLine not found");
    }
  } catch (error: any) {
    console.error("Error setting noSeries:", error);
    throw new Error(error.message);
  }
};

//update noSeriesLine
const updateNoSeriesLine = async (
  noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput,
  nextNoSeriesLine: string
) => {
  try {
    const lastNoUsed = await incrementString(nextNoSeriesLine);
    const updatedNoSeriesLine = await db.noSeriesLine.update({
      where: {
        id: noSeriesLine.id,
      },
      data: {
        lastNoUsed,
        lastDateUsed: new Date().toISOString(),
      },
    });
    return updatedNoSeriesLine;
  } catch (error: any) {
    console.error("Error updating noSeriesLine:", error);
    throw new Error("Unexpected error occurred. Please try again later.");
  }
};
