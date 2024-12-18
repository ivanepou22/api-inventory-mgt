import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { setNoSeries, updateNoSeries } from "@/utils/noSeriesManagement";

class ContactService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createContact(contact: Prisma.ContactUncheckedCreateInput) {
    const { name, phone, email, image, userId } = contact;

    try {
      const code = await setNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "contactNos"
      );
      // check if the code is already in use by another Contact
      const existingContact = await this.findUnique(
        (args) => this.db.contact.findUnique(args),
        {
          where: {
            tenantId_companyId_code: {
              code: code,
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
            },
          },
        }
      );
      if (existingContact) {
        throw new Error(`No: ${code} is already in use by another Contact`);
      }
      const newContact = await this.create(
        (args) => this.db.contact.create(args),
        {
          data: {
            code,
            name,
            phone,
            email,
            image,
            userId,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
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
      // Update the no series last used
      await updateNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "contactNos"
      );
      return {
        data: newContact,
        message: "Contact created successfully",
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

  async getContacts() {
    try {
      const contacts = await this.findMany(
        (args) => this.db.contact.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
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
        data: contacts,
        message: "Contacts fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getContact(id: string) {
    try {
      const contact = await this.findUnique(
        (args) => this.db.contact.findUnique(args),
        {
          where: { id },
          include: {
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

      if (!contact) {
        throw new Error("Contact not found.");
      }

      return {
        data: contact,
        message: "Contact fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateContact(
    id: string,
    contactData: Prisma.ContactUncheckedCreateInput
  ) {
    const { code } = contactData;

    try {
      const contactExists = await this.findUnique(
        (args) => this.db.contact.findUnique(args),
        {
          where: { id },
        }
      );
      if (!contactExists) {
        throw new Error("Contact not found.");
      }

      // Check if the code is already in use by another Contact
      if (code && code !== contactExists.code) {
        const existingContact = await this.findUnique(
          (args) => this.db.contact.findUnique(args),
          {
            where: {
              tenantId_companyId_Code: {
                Code: code,
                tenantId: this.getTenantId(),
                companyId: this.getCompanyId(),
              },
            },
          }
        );
        if (existingContact) {
          throw new Error(
            `Code "${code}" is already in use by another Contact`
          );
        }
      }
      const updatedContact = await this.update(
        (args) => this.db.contact.update(args),
        {
          where: { id },
          data: contactData,
          include: {
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
        data: updatedContact,
        message: "Contact updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteContact(id: string) {
    try {
      const contact = await this.findUnique(
        (args) => this.db.contact.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!contact) {
        throw new Error("Contact not found.");
      }
      const deletedContact = await this.delete(
        (args) => this.db.contact.delete(args),
        { where: { id } }
      );
      return {
        data: deletedContact,
        message: `Contact deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

// Export the service
export const contactService = (): ContactService => {
  return new ContactService(db);
};
