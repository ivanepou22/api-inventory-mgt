import { AsyncLocalStorage } from "async_hooks";
import { PrismaClient } from "@prisma/client";

// Tenant Context Manager
interface TenantContext {
  tenantId: string;
}

export class ContextManager {
  private static instance: ContextManager;
  private storage: AsyncLocalStorage<TenantContext>;
  private prisma: PrismaClient;

  private constructor() {
    this.storage = new AsyncLocalStorage<TenantContext>();
    this.prisma = new PrismaClient();
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
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
}
