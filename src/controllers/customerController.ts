import { db } from "@/db/db";
import { Request, Response } from "express";

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const {
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    image,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    NIN,
  } = req.body;

  const customerByPhone = await db.customer.findUnique({
    where: {
      phone,
    },
  });
  if (customerByPhone) {
    return res.status(409).json({
      error: `Phone Number: ${phone} is Already in use by another Customer`,
      data: null,
    });
  }

  if (email) {
    const customerByEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });
    if (customerByEmail) {
      return res.status(409).json({
        error: `Email: ${email} is Already in use by another Customer`,
        data: null,
      });
    }
  }

  if (NIN) {
    const customerByNin = await db.customer.findUnique({
      where: {
        NIN,
      },
    });
    if (customerByNin) {
      return res.status(409).json({
        error: `NIN: ${NIN} is Already in use by another Customer`,
        data: null,
      });
    }
  }

  try {
    const newCustomer = await db.customer.create({
      data: {
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        country,
        location,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        NIN,
        image: image
          ? image
          : "https://utfs.io/f/276c9ec4-bff3-40fc-8759-6b4c362c1e59-o0u7dg.png",
      },
    });

    return res.status(201).json({
      data: newCustomer,
      message: "Customer created Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create customer" });
  }
};

// Get all customers
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve customers" });
  }
};

// Get a single customer by ID
export const getCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json({
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve customer" });
  }
};

// Update a customer by ID
export const updateCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    image,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    NIN,
  } = req.body;

  try {
    const existingCustomer = await db.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (phone && phone !== existingCustomer.phone) {
      const customerByPhone = await db.customer.findUnique({
        where: {
          phone,
        },
      });
      if (customerByPhone) {
        return res.status(409).json({
          error: `Phone Number: ${phone} is Already in use by another Customer`,
          data: null,
        });
      }
    }

    if (email && email !== existingCustomer.email) {
      const customerByEmail = await db.customer.findUnique({
        where: {
          email,
        },
      });
      if (customerByEmail) {
        return res.status(409).json({
          error: `Email: ${email} is Already in use by another Customer`,
          data: null,
        });
      }
    }

    if (NIN && NIN !== existingCustomer.NIN) {
      const customerByNin = await db.customer.findUnique({
        where: {
          NIN,
        },
      });
      if (customerByNin) {
        return res.status(409).json({
          error: `NIN: ${NIN} is Already in use by another Customer`,
          data: null,
        });
      }
    }

    const updatedCustomer = await db.customer.update({
      where: { id },
      data: {
        customerType: customerType || existingCustomer.customerType,
        firstName: firstName || existingCustomer.firstName,
        lastName: lastName || existingCustomer.lastName,
        phone: phone || existingCustomer.phone,
        gender: gender || existingCustomer.gender,
        image: image || existingCustomer.image,
        country: country || existingCustomer.country,
        location: location || existingCustomer.location,
        maxCreditLimit: maxCreditLimit || existingCustomer.maxCreditLimit,
        maxCreditDays: maxCreditDays || existingCustomer.maxCreditDays,
        taxPin: taxPin || existingCustomer.taxPin,
        dob: dob || existingCustomer.dob,
        email: email || existingCustomer.email,
        NIN: NIN || existingCustomer.NIN,
      },
    });

    return res.status(200).json({
      data: updatedCustomer,
      message: `Customer updated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const existingCustomer = await db.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await db.customer.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Customer deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete customer" });
  }
};
