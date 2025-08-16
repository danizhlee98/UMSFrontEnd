import { z } from "zod";

export const loginRequest = z.object({
  userName: z.string(),
  password: z.string(),
})

export const loginResponse = z.object({
  token: z.string(),
  expiration: z.date()
})

export const userRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  pathUrl: z.string().optional()
});

export type LoginRequest = z.infer<typeof loginRequest>;

export type LoginResponse = z.infer<typeof loginResponse>;