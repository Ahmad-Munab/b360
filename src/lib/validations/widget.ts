import { z } from "zod";

export const widgetFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format - use 6-digit hex code (#RRGGBB)"),
  productType: z.enum(["saas", "portfolio"]),
  productName: z.string().min(1, "Product name is required").max(100, "Product name must be less than 100 characters"),
  features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required").max(10, "Maximum 10 features allowed"),
  description: z.string().min(20, "Description must be at least 20 words").max(500, "Description must be less than 500 characters"),
  faqs: z.array(z.object({
    question: z.string().min(1, "Question is required").max(200, "Question must be less than 200 characters"),
    answer: z.string().min(1, "Answer is required").max(1000, "Answer must be less than 1000 characters"),
  })).max(3, "Maximum 3 FAQs allowed"),
  widgetTitle: z.string().min(1, "Widget title is required").max(50, "Widget title must be less than 50 characters"),
  welcomeMessage: z.string().min(1, "Welcome message is required").max(200, "Welcome message must be less than 200 characters"),
  feedbackQuestion: z.string().max(200, "Feedback question must be less than 200 characters"),
  enableBugReports: z.boolean(),
  isActive: z.boolean(),
});

export type WidgetFormValues = z.infer<typeof widgetFormSchema>;
