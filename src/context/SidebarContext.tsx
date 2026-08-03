import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { STORAGE_KEYS } from '@/constants';

type SidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

function getStoredCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState<boolean>(getStoredCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed));
  }, [collapsed]);

  const value: SidebarContextValue = {
    collapsed,
    toggleCollapsed: () => setCollapsedState((p) => !p),
    setCollapsed: setCollapsedState,
    mobileOpen,
    setMobileOpen,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
