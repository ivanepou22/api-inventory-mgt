import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

class CustomerService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createCustomer(customer: Prisma.CustomerUncheckedCreateInput) {
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

    const customerExists = await this.findUnique(
      (args) => this.db.customer.findUnique(args),
      { where: { phone } }
    );
    if (customerExists) {
      throw new Error(
        `Phone Number: ${phone} is already in use by another Customer`
      );
    }

    if (email) {
      const customerByEmail = await this.findUnique(
        (args) => this.db.customer.findUnique(args),
        { where: { email } }
      );
      if (customerByEmail) {
        throw new Error(
          `Email: ${email} is already in use by another Customer`
        );
      }
    }

    try {
      const newCustomer = await this.create(
        (args) => this.db.customer.create(args),
        {
          data: {
            ...customer,
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
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
            salesPerson: true,
            customerPostingGroup: true,
            genBusPostingGroup: true,
            vatBusPostingGroup: true,
            salesHeaders: true,
          },
        }
      );
      return {
        data: newCustomer,
        message: "Customer created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Customer:", error);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getCustomers() {
    try {
      const customers = await this.findMany(
        (args) => this.db.customer.findMany(args),
        {
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
        }
      );
      return {
        data: customers,
        message: "Customers fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getCustomer(id: string) {
    try {
      const customer = await this.findUnique(
        (args) => this.db.customer.findUnique(args),
        {
          where: { id },
          include: {
            salesPerson: true,
            customerPostingGroup: true,
            genBusPostingGroup: true,
            vatBusPostingGroup: true,
            salesHeaders: true,
          },
        }
      );

      if (!customer) {
        throw new Error("Customer not found.");
      }

      return {
        data: customer,
        message: "Customer fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateCustomer(id: string, customerData: Prisma.CustomerCreateInput) {
    const { phone, email } = customerData;

    try {
      const customerExists = await this.findUnique(
        (args) => this.db.customer.findUnique(args),
        {
          where: { id },
          select: { id: true, name: true, phone: true, email: true },
        }
      );
      if (!customerExists) {
        throw new Error("Customer not found.");
      }
      if (phone && phone !== customerExists.phone) {
        const customerByPhone = await this.findUnique(
          (args) => this.db.customer.findUnique(args),
          { where: { phone } }
        );
        if (customerByPhone) {
          throw new Error(
            `Phone Number: ${phone} is already in use by another Customer`
          );
        }
      }

      if (email && email !== customerExists.email) {
        const customerByEmail = await this.findUnique(
          (args) => this.db.customer.findUnique(args),
          { where: { email } }
        );
        if (customerByEmail) {
          throw new Error(
            `Email: ${email} is already in use by another Customer`
          );
        }
      }

      const updatedCustomer = await this.update(
        (args) => this.db.customer.update(args),
        {
          where: { id },
          data: customerData,
          include: {
            salesPerson: true,
            customerPostingGroup: true,
            genBusPostingGroup: true,
            vatBusPostingGroup: true,
            salesHeaders: true,
          },
        }
      );

      return {
        data: updatedCustomer,
        message: "Customer updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteCustomer(id: string) {
    try {
      const customer = await this.findUnique(
        (args) => this.db.customer.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!customer) {
        throw new Error("Customer not found.");
      }
      const deletedCustomer = await this.delete(
        (args) => this.db.customer.delete(args),
        { where: { id } }
      );
      return {
        data: deletedCustomer,
        message: `Customer deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

// Export the service
export const customerService = (): CustomerService => {
  return new CustomerService(db);
};
