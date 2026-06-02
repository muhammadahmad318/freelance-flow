/**
 * src/features/auth/validation/authSchema.ts
 *
 * Centralized Zod validation schemas and DTO types for the Authentication domain.
 */
import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
  .regex(/[0-9]/, { message: "Must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Must contain at least one special character.",
  });

/**
 * Validation schema for user authentication.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .regex(emailRegex, { message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

/**
 * Validation schema for new user registration.
 * Enforces strict password criteria and confirmation matching.
 */
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .regex(emailRegex, { message: "Please enter a valid email address." }),
    password: strongPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginDTO = z.infer<typeof loginSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;
