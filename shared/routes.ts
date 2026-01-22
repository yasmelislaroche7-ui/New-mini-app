import { z } from 'zod';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // We can add server-side tracking if needed, but this is primarily a client-side dApp
  users: {
    getOrCreate: {
      method: 'POST' as const,
      path: '/api/users',
      input: z.object({
        walletAddress: z.string(),
      }),
      responses: {
        200: z.object({ id: z.number(), walletAddress: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
