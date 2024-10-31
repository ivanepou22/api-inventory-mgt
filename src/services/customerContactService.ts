import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

class CustomerContactService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createCustomerContact(
    customerContact: Prisma.CustomerContactUncheckedCreateInput
  ) {
    try {
      const newCustomerContact = await this.create(
        (args) => this.db.customerContact.create(args),
        {
          data: {
            ...customerContact,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                maxCreditLimit: true,
                maxCreditDays: true,
                taxPin: true,
                regNumber: true,
                paymentTerms: true,
                NIN: true,
                customerPostingGroupId: true,
                genBusPostingGroupId: true,
                vatBusPostingGroupId: true,
                salesPersonId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );
      return {
        data: newCustomerContact,
        message: "CustomerContact created successfully",
      };
    } catch (error: any) {
      console.error("Error creating CustomerContact:", error);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getCustomerContacts() {
    try {
      const customerContacts = await this.findMany(
        (args) => this.db.customerContact.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                maxCreditLimit: true,
                maxCreditDays: true,
                taxPin: true,
                regNumber: true,
                paymentTerms: true,
                NIN: true,
                customerPostingGroupId: true,
                genBusPostingGroupId: true,
                vatBusPostingGroupId: true,
                salesPersonId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );
      return {
        data: customerContacts,
        message: "CustomerContacts fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getCustomerContact(id: string) {
    try {
      const customerContact = await this.findUnique(
        (args) => this.db.customerContact.findUnique(args),
        {
          where: { id },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                maxCreditLimit: true,
                maxCreditDays: true,
                taxPin: true,
                regNumber: true,
                paymentTerms: true,
                NIN: true,
                customerPostingGroupId: true,
                genBusPostingGroupId: true,
                vatBusPostingGroupId: true,
                salesPersonId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );

      if (!customerContact) {
        throw new Error("CustomerContact not found.");
      }

      return {
        data: customerContact,
        message: "CustomerContact fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateCustomerContact(
    id: string,
    customerContactData: Prisma.CustomerContactUncheckedCreateInput
  ) {
    try {
      const customerContactExists = await this.findUnique(
        (args) => this.db.customerContact.findUnique(args),
        {
          where: { id },
        }
      );
      if (!customerContactExists) {
        throw new Error("CustomerContact not found.");
      }
      const updatedCustomerContact = await this.update(
        (args) => this.db.customerContact.update(args),
        {
          where: { id },
          data: customerContactData,
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                maxCreditLimit: true,
                maxCreditDays: true,
                taxPin: true,
                regNumber: true,
                paymentTerms: true,
                NIN: true,
                customerPostingGroupId: true,
                genBusPostingGroupId: true,
                vatBusPostingGroupId: true,
                salesPersonId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );

      return {
        data: updatedCustomerContact,
        message: "CustomerContact updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteCustomerContact(id: string) {
    try {
      const customerContact = await this.findUnique(
        (args) => this.db.customerContact.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!customerContact) {
        throw new Error("CustomerContact not found.");
      }
      const deletedCustomerContact = await this.delete(
        (args) => this.db.customerContact.delete(args),
        { where: { id } }
      );
      return {
        data: deletedCustomerContact,
        message: `CustomerContact deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

// Export the service
export const customerContactService = (): CustomerContactService => {
  return new CustomerContactService(db);
};
