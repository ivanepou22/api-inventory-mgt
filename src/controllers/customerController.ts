import { db } from "@/db/db";
import { Request, Response } from "express";

export const createCustomer = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  try {
    const newCustomer = await db.customer.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return res.status(201).json(newCustomer);
  } catch (error) {
    console.log(error);
  }
};

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(customers);
  } catch (error) {
    console.log(error);
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
    });
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error);
  }
};
