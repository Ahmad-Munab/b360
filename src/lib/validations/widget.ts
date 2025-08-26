import { z } from "zod";

export const widgetFormSchema = z.object({
  customIcon: z.string().optional(),
  iconEmoji: z.string().optional(),
  iconType: z.enum(["default", "emoji", "image"]).default("default"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  primaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Invalid color format - use 6-digit hex code (#RRGGBB)"
    ),
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  widgetTitle: z
    .string()
    .min(1, "Widget title is required")
    .max(50, "Widget title must be less than 50 characters"),
  welcomeMessage: z
    .string()
    .min(1, "Welcome message is required")
    .max(200, "Welcome message must be less than 200 characters"),
  isActive: z.boolean(),
  adminEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")).optional(),
});

export type WidgetFormValues = z.infer<typeof widgetFormSchema>;
