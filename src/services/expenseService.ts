import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createExpense = async (expense: Prisma.ExpenseUncheckedCreateInput) => {
  const {
    title,
    amount,
    date,
    description,
    attachments,
    shopId,
    expenseCategoryId,
    payeeId,
  } = expense;

  try {
    const newExpense = await db.expense.create({
      data: {
        title,
        amount,
        date,
        description,
        attachments,
        shopId,
        expenseCategoryId,
        payeeId,
      },
    });
    return {
      data: newExpense,
      message: "Expense created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Expense:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getExpenses = async () => {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: expenses,
      message: "Expenses fetched successfully",
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

const getExpense = async (id: string) => {
  try {
    const expense = await db.expense.findUnique({
      where: {
        id,
      },
    });
    if (!expense) {
      throw new Error("Expense not found.");
    }
    return {
      data: expense,
      message: "Expense fetched successfully",
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

const updateExpense = async (
  id: string,
  expense: Prisma.ExpenseUncheckedCreateInput
) => {
  const {
    title,
    amount,
    date,
    description,
    attachments,
    shopId,
    expenseCategoryId,
    payeeId,
  } = expense;

  try {
    const expenseExists = await db.expense.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        amount: true,
        date: true,
        description: true,
        attachments: true,
        shopId: true,
        expenseCategoryId: true,
        payeeId: true,
      },
    });
    if (!expenseExists) {
      throw new Error("Expense not found.");
    }
    // Perform the update
    const updatedExpense = await db.expense.update({
      where: { id },
      data: {
        title,
        amount,
        date,
        description,
        attachments,
        shopId,
        expenseCategoryId,
        payeeId,
      },
    });

    return {
      data: updatedExpense,
      message: "Expense created Successfully.",
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

const deleteExpense = async (id: string) => {
  try {
    // Check if the expense exists
    const expense = await db.expense.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!expense) {
      throw new Error("Expense not found.");
    }
    // Delete the expense
    const deletedExpense = await db.expense.delete({
      where: { id },
    });
    return {
      data: deletedExpense,
      message: `Expense deleted successfully`,
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

export const expenseService = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
