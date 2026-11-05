// Mock Prisma client for build/deployment without database
// In production, replace with actual Prisma client after running `prisma generate`

let prismaInstance: any;

class MockPrismaClient {
  user = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock_' + Date.now(), ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async () => ({}),
  };
  dataset = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'ds_' + Date.now(), ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async () => ({}),
  };
  account = { findMany: async () => [], create: async () => ({}) };
  session = { findMany: async () => [], create: async () => ({}) };
  verificationToken = { findMany: async () => [], create: async () => ({}) };
  $connect = async () => {};
  $disconnect = async () => {};
}

try {
  // Try to use actual Prisma client if available
  const { PrismaClient: RealPrismaClient } = require('@prisma/client');
  const globalForPrisma = global as unknown as { prisma: typeof prismaInstance };
  prismaInstance = globalForPrisma.prisma || new RealPrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
} catch {
  // Fallback to mock client
  const globalForPrisma = global as unknown as { prisma: typeof prismaInstance };
  prismaInstance = globalForPrisma.prisma || new MockPrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
