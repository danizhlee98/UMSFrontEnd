import { z } from "zod";

export const loginRequest = z.object({
  userName: z.string(),
  password: z.string(),
})

export const loginResponse = z.object({
  token: z.string(),
  expiration: z.date()
})

export const userResponseSchema = z.object({
  message: z.string(),
  success: z.boolean()
})

export const userRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  pathUrl: z.string().optional()
});

export type LoginRequest = z.infer<typeof loginRequest>;

export type LoginResponse = z.infer<typeof loginResponse>;

export type UserRequest = z.infer<typeof userRequestSchema>;

export type UserResponse = z.infer<typeof userResponseSchema>;