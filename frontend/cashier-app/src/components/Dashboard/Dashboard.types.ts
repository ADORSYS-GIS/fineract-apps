export interface DashboardViewProps {
  readonly onToggleMenu?: () => void;
  readonly isMenuOpen?: boolean;
  readonly onLogout: () => void;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}