import {
  AppLayout,
  Button,
  Navbar,
  Sidebar,
  menuCashier,
} from '@fineract-apps/ui';
import { Bell, UserCircle } from 'lucide-react';
import { ClientSearch } from '../ClientSearch';
import { DashboardViewProps } from './Dashboard.types';

export function DashboardView({
  onToggleMenu,
  isMenuOpen,
  onLogout,
  query,
  onQueryChange,
}: Readonly<DashboardViewProps>) {
  return (
    <AppLayout
      navbar={
        <Navbar
          logo={<h1 className="text-lg font-bold">Cashier App</h1>}
          links={null}
          notifications={<Bell />}
          userSection={
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              <UserCircle className="w-5 h-5 text-gray-600" />
            </div>
          }
          actions={<Button onClick={onLogout}>Logout</Button>}
          onToggleMenu={onToggleMenu}
          isMenuOpen={isMenuOpen}
          variant="primary"
          size="md"
        />
      }
      sidebar={<Sidebar menuItems={menuCashier} onLogout={onLogout} />}
    >
      <ClientSearch
        query={query}
        onQueryChange={onQueryChange}
      />
    </AppLayout>
  );
}
