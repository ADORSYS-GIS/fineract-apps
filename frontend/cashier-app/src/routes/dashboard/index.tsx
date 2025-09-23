import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/Dashboard';
import { z } from 'zod';

const dashboardSearchSchema = z.object({
  query: z.string().catch(''),
});

export const Route = createFileRoute('/dashboard/')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: Dashboard,
});