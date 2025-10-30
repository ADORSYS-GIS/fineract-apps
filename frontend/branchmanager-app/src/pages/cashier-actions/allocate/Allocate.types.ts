import { z } from "zod";
import { cashierActionSchema } from "@/components/CashierActionForm";

export const allocateSchema = cashierActionSchema;

export type FormValues = z.infer<typeof allocateSchema>;
