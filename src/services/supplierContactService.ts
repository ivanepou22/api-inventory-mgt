import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

export class SupplierContactService extends MultiTenantService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async getSupplierContacts(tenantId: string, companyId: string) {
    const supplierContacts = await db.supplierContact.findMany({
      where: {
        tenantId: tenantId,
        companyId: companyId,
      },
    });
    return supplierContacts;
  }

  async getSupplierContact(tenantId: string, companyId: string, id: string) {
    const supplierContact = await db.supplierContact.findUnique({
      where: {
        id: id,
        tenantId: tenantId,
        companyId: companyId,
      },
    });
    return supplierContact;
  }

  async createSupplierContact(
    tenantId: string,
    companyId: string,
    supplierContact: Prisma.SupplierContactUncheckedCreateInput
  ) {
    const newSupplierContact = await db.supplierContact.create({
      data: supplierContact,
      include: {
        supplier: {
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
            supplierPostingGroupId: true,
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
    });

    return newSupplierContact;
  }

  async updateSupplierContact(
    tenantId: string,
    companyId: string,
    id: string,
    supplierContact: Prisma.SupplierContactUncheckedCreateInput
  ) {
    const updatedSupplierContact = await db.supplierContact.update({
      where: {
        id: id,
        tenantId: tenantId,
        companyId: companyId,
      },
      data: supplierContact,
      include: {
        supplier: {
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
            supplierPostingGroupId: true,
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
    });
    return updatedSupplierContact;
  }

  async deleteSupplierContact(tenantId: string, companyId: string, id: string) {
    const deletedSupplierContact = await db.supplierContact.delete({
      where: {
        id: id,
        tenantId: tenantId,
        companyId: companyId,
      },
    });
    return deletedSupplierContact;
  }
}
