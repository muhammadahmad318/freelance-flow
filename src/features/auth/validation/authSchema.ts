/**
 * src/features/auth/validation/authSchema.ts
 *
 * Centralized Zod validation schemas for the Authentication domain.
 * Acts as the single source of truth for form validation and DTO types.
 */
import { z } from "zod";

/**
 * Standard email regex to prevent the ZodString.email() deprecation warning
 * we encountered in the Client module.
 */
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Reusable Password Schema for Signup & Password Reset flows.
 * Uses granular regex chaining so we can return highly specific error messages.
 * This will be heavily utilized by our PasswordStrengthMeter component in Task 3.
 */
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
 * Schema for the Login Form.
 * Note: We intentionally do NOT use strongPasswordSchema here. If a legacy user
 * has a weak password, or if our password policy changes in the future, we do
 * not want to block them from logging in.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .regex(emailRegex, { message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

/**
 * Schema for the Signup Form.
 * Implements full strict validation and password confirmation matching.
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
    path: ["confirmPassword"], // Attaches the error specifically to the confirmPassword field
  });

// Automatically infer TypeScript interfaces from our Zod schemas
export type LoginDTO = z.infer<typeof loginSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;
