import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { setNoSeries, updateNoSeries } from "@/utils/noSeriesManagement";

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
      taxPin,
      regNumber,
      paymentTerms,
      NIN,
      customerPostingGroupId,
      genBusPostingGroupId,
      vatBusPostingGroupId,
      salesPersonId,
      userId,
    } = customer;

    try {
      const customerNo = await setNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "customerNos"
      );

      const customerEx = await this.findUnique(
        (args) => this.db.customer.findUnique(args),
        {
          where: {
            tenantId_companyId_No: {
              No: customerNo,
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
            },
          },
        }
      );
      if (customerEx) {
        throw new Error(
          `No: ${customerNo} is already in use by another Customer`
        );
      }

      const newCustomer = await this.create(
        (args) => this.db.customer.create(args),
        {
          data: {
            No: customerNo,
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
            taxPin,
            regNumber,
            paymentTerms,
            NIN,
            customerPostingGroupId,
            genBusPostingGroupId,
            vatBusPostingGroupId,
            salesPersonId,
            userId,
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
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        }
      );

      await updateNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "customerNos"
      );

      return {
        data: newCustomer,
        message: "Customer created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Customer:", error);
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Check if the error message contains the word "Argument"
        const argumentIndex = errorMessage.toLowerCase().indexOf("argument");
        if (argumentIndex !== -1) {
          // Extract the message after "Argument"
          const relevantError = errorMessage.slice(argumentIndex);
          throw new Error(relevantError);
        } else {
          // For other types of errors, you might want to log the full error
          // and throw a generic message to the user
          console.error("Full error:", error);
          throw new Error(error.message);
        }
      } else {
        // Handle case where error is not an Error object
        throw new Error("An unexpected error occurred.");
      }
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
            OnlineOrderSetup: true,
            CustomerContact: true,
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
            OnlineOrderSetup: true,
            CustomerContact: true,
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
