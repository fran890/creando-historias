import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const RegisterUserSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "El username solo puede contener letras, números, guiones y guiones bajos",
  }),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "AUTHOR"]).default("AUTHOR"),
});

export const ArticleSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres" }).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, { message: "El contenido es demasiado corto" }),
  featuredImage: z.string().optional().nullable().or(z.literal("")),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(200).optional(),
  canonicalUrl: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "ARCHIVED"]).optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
});

export const SettingsSchema = z.object({
  platformSharePercentage: z.number().min(0).max(100),
  authorSharePercentage: z.number().min(0).max(100),
});
