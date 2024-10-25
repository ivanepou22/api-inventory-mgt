import { db } from "@/db/db";
import { Prisma } from "@prisma/client";
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

//get customer series
const getCustomerSeriesNo = async (tenantId: string, companyId: string) => {
  try {
    const noSeriesSetup = await getNoSeriesSetup(tenantId, companyId);
    return noSeriesSetup.customerNos;
  } catch (error: any) {
    console.error("Error getting customer series:", error);
    throw new Error(error.message);
  }
};

//setCustomer Series
export const setCustomerNoSeries = async (
  tenantId: string,
  companyId: string
) => {
  try {
    const customerSeriesNo = await getCustomerSeriesNo(tenantId, companyId);
    if (!customerSeriesNo) {
      throw new Error("Customer noSeries No. not Setup");
    }
    const noSeries = await getNoSeries(tenantId, companyId, customerSeriesNo);
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
    console.error("Error setting customer noSeries:", error);
    throw new Error(error.message);
  }
};
