import { AsyncLocalStorage } from "async_hooks";
import { PrismaClient } from "@prisma/client";

// Tenant Context Manager
interface TenantContext {
  tenantId: string;
  companyId: string;
}

export class TenantContextManager {
  private static instance: TenantContextManager;
  private storage: AsyncLocalStorage<TenantContext>;
  private prisma: PrismaClient;

  private constructor() {
    this.storage = new AsyncLocalStorage<TenantContext>();
    this.prisma = new PrismaClient();
  }

  public static getInstance(): TenantContextManager {
    if (!TenantContextManager.instance) {
      TenantContextManager.instance = new TenantContextManager();
    }
    return TenantContextManager.instance;
  }

  public run(
    context: TenantContext,
    callback: () => Promise<void>
  ): Promise<void> {
    return this.storage.run(context, callback);
  }

  public getContext(): TenantContext | undefined {
    return this.storage.getStore();
  }

  public async tenantExists(tenantId: string): Promise<boolean> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });
      return !!tenant;
    } catch (error) {
      console.error("Error checking tenant existence:", error);
      return false;
    }
  }

  public async companyExistsUnderTenant(
    tenantId: string,
    companyId: string
  ): Promise<boolean> {
    try {
      const company = await this.prisma.company.findFirst({
        where: {
          id: companyId,
          tenantId: tenantId,
        },
      });
      return !!company;
    } catch (error) {
      console.error("Error checking company existence:", error);
      return false;
    }
  }
}
