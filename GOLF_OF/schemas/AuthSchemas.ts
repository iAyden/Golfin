import { z } from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3),
    
  email: z
    .string()
    .trim()
    .email("Email format is not valid"),
    
  password: z
    .string()
    .min(8),
});
