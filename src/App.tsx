import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { routes } from '@/routes';

function AppRoutes() {
  return useRoutes(routes);
}

function ThemedToast() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: resolvedTheme === 'dark' ? '#0F2A2A' : '#ffffff',
          color: resolvedTheme === 'dark' ? '#E3EDEB' : '#0F2A2A',
          border:
            resolvedTheme === 'dark' ? '1px solid #1F3A36' : '1px solid #E3EDEB',
          borderRadius: '12px',
          fontSize: '14px',
          padding: '12px 16px',
          boxShadow:
            resolvedTheme === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(15,42,42,0.12)',
        },
        success: {
          iconTheme: { primary: '#00BFA6', secondary: '#fff' },
          style: {
            borderLeft: '3px solid #00BFA6',
          },
        },
        error: {
          iconTheme: { primary: '#F04438', secondary: '#fff' },
          style: {
            borderLeft: '3px solid #F04438',
          },
        },
      }}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <AppRoutes />
          <ThemedToast />
        </BrowserRouter>
      </SidebarProvider>
    </ThemeProvider>
  );
}
