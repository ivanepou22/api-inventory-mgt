import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

//create a service to create a customer
export const createCustomer = async (customer: Prisma.CustomerCreateInput) => {
  const {
    customerType,
    name,
    phone,
    email,
    image,
    country,
    address,
    address_2,
    website,
    maxCreditLimit,
    maxCreditDays,
    contactPerson,
    contact_phone,
    contact_email,
    taxPin,
    regNumber,
    paymentTerms,
    NIN,
  } = customer;

  const customerExists = await db.customer.findUnique({
    where: {
      phone,
    },
  });
  if (customerExists) {
    throw new Error(
      `Phone Number: ${phone} is Already in use by another Customer`
    );
  }

  if (email) {
    const customerByEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });
    if (customerByEmail) {
      throw new Error(`Email: ${email} is Already in use by another Customer`);
    }
  }

  try {
    const newCustomer = await db.customer.create({
      data: {
        customerType,
        name,
        phone,
        email,
        country,
        address,
        address_2,
        website,
        maxCreditLimit,
        maxCreditDays,
        contactPerson,
        contact_phone,
        contact_email,
        taxPin,
        regNumber,
        paymentTerms,
        NIN,
        image: image
          ? image
          : "https://utfs.io/f/276c9ec4-bff3-40fc-8759-6b4c362c1e59-o0u7dg.png",
      },
      include: {
        salesPerson: true,
        customerPostingGroup: true,
        genBusPostingGroup: true,
        vatBusPostingGroup: true,
        salesHeaders: true,
      },
    });
    return {
      data: newCustomer,
      message: "Customer created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Customer:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

//Get all customers
export const getCustomers = async () => {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        salesPerson: true,
        customerPostingGroup: true,
        genBusPostingGroup: true,
        vatBusPostingGroup: true,
        salesHeaders: true,
      },
    });
    return {
      data: customers,
      message: "Customers fetched successfully",
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

//Get a customer by id
export const getCustomer = async (id: string) => {
  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
      include: {
        salesPerson: true,
        customerPostingGroup: true,
        genBusPostingGroup: true,
        vatBusPostingGroup: true,
        salesHeaders: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return {
      data: customer,
      message: "Customer fetched successfully",
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

//Update a customer
export const updateCustomer = async (
  id: string,
  customer: Prisma.CustomerCreateInput
) => {
  const {
    customerType,
    name,
    phone,
    email,
    image,
    country,
    address,
    address_2,
    website,
    maxCreditLimit,
    maxCreditDays,
    contactPerson,
    contact_phone,
    contact_email,
    taxPin,
    regNumber,
    paymentTerms,
    NIN,
  } = customer;

  try {
    const customerExists = await db.customer.findUnique({
      where: { id },
      select: { id: true, name: true, phone: true, email: true },
    });
    if (!customerExists) {
      throw new Error("Customer not found.");
    }
    if (phone && phone !== customerExists.phone) {
      const customerByPhone = await db.customer.findUnique({
        where: {
          phone,
        },
      });
      if (customerByPhone) {
        throw new Error(
          `Phone Number: ${phone} is Already in use by another Customer`
        );
      }
    }

    if (email && email !== customerExists.email) {
      const customerByEmail = await db.customer.findUnique({
        where: {
          email,
        },
      });
      if (customerByEmail) {
        throw new Error(
          `Email: ${email} is Already in use by another Customer`
        );
      }
    }
    // Perform the update
    const updatedCustomer = await db.customer.update({
      where: { id },
      data: {
        customerType,
        name,
        phone,
        email,
        image,
        country,
        address,
        address_2,
        website,
        maxCreditLimit,
        maxCreditDays,
        contactPerson,
        contact_phone,
        contact_email,
        taxPin,
        regNumber,
        paymentTerms,
        NIN,
      },
      include: {
        salesPerson: true,
        customerPostingGroup: true,
        genBusPostingGroup: true,
        vatBusPostingGroup: true,
        salesHeaders: true,
      },
    });

    return {
      data: updatedCustomer,
      message: "Customer created Successfully.",
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

//delete
export const deleteCustomer = async (id: string) => {
  try {
    // Check if the customer exists
    const customer = await db.customer.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!customer) {
      throw new Error("Customer not found.");
    }
    // Delete the customer
    const deletedCustomer = await db.customer.delete({
      where: { id },
    });
    return {
      data: deletedCustomer,
      message: `Customer deleted successfully`,
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

export const customerService = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
