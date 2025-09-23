import { createFileRoute, redirect } from '@tanstack/react-router';
import { authStore } from '@/store/auth';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (authStore.state.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
        search: { query: '' },
      });
    } else {
      throw redirect({
        to: '/login',
      });
    }
  },
});
