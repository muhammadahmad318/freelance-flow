/**
 * src/features/clients/validation/clientSchema.ts
 *
 * Runtime validation schemas for the Client domain using Zod.
 */

import { z } from "zod";
import type { CreateClientDTO } from "@/features/clients/types/client";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Schema for creating a new client.
 * Enforces business rules defined in FR-9.
 */
export const createClientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .regex(emailRegex, { message: "Please enter a valid email address." }),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
}) satisfies z.ZodType<CreateClientDTO>;
