import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import AuthGate from './components/AuthGate';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import AppShell from './components/layout/AppShell';
import WeeklySchedulePage from './pages/WeeklySchedulePage';
import AbsencesPage from './pages/AbsencesPage';
import WeeklyHoursPage from './pages/WeeklyHoursPage';
import ReportsPage from './pages/ReportsPage';
import ManagePage from './pages/ManagePage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

// Layout component that includes AppShell
function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WeeklySchedulePage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule',
  component: WeeklySchedulePage,
});

const hoursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hours',
  component: WeeklyHoursPage,
});

const absencesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/absences',
  component: AbsencesPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const manageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage',
  component: ManagePage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  scheduleRoute,
  hoursRoute,
  absencesRoute,
  reportsRoute,
  manageRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
