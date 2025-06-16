import { z } from "zod";

export const loginSchema = z.object({    
  email: z
    .string()
    .trim()
    .email("Email format is not valid"),
    
  password: z
    .string()
    .min(8)
    .trim(),
});

export type loginSchemaType = z.infer<typeof loginSchema>; //exportar schema del login

export const signupSchema = z.object({
  complete_name: z
  .string()
  .min(3)
  .trim(),
  
  email: z
  .string()
  .trim()
  .email("Email format is not valid"),

  password: z
  .string()
  .min(8)
  .trim(),

  confirm_password: z
  .string()
  .trim()
  .min(8),
}).refine((data) => data.password == data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

export type signupSchemaType = z.infer<typeof signupSchema>; //exportar schema del signup
