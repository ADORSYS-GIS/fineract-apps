import { z } from "zod";
import { cashierActionSchema } from "@/components/CashierActionForm";

export const settleSchema = cashierActionSchema;

export type FormValues = z.infer<typeof settleSchema>;
