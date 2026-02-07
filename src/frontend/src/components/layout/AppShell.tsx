import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, UserX, BarChart3, Settings, User, LogOut, Menu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ to, icon, children, onClick }: NavLinkProps) {
  const router = useRouterState();
  const isActive = router.location.pathname === to || (to === '/schedule' && router.location.pathname === '/');

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium touch-manipulation ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = (
    <>
      <NavLink to="/schedule" icon={<Calendar className="h-5 w-5" />} onClick={closeMobileMenu}>
        Schedule
      </NavLink>
      <NavLink to="/hours" icon={<Clock className="h-5 w-5" />} onClick={closeMobileMenu}>
        Weekly Hours
      </NavLink>
      <NavLink to="/absences" icon={<UserX className="h-5 w-5" />} onClick={closeMobileMenu}>
        Absences
      </NavLink>
      <NavLink to="/reports" icon={<BarChart3 className="h-5 w-5" />} onClick={closeMobileMenu}>
        Reports
      </NavLink>
      <NavLink to="/manage" icon={<Settings className="h-5 w-5" />} onClick={closeMobileMenu}>
        Manage
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/planner-logo.dim_512x512.png"
              alt="College Planner"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">College Planner</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">{navLinks}</nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 touch-manipulation">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                    {userProfile?.email && (
                      <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10 touch-manipulation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <nav className="flex flex-col gap-2 mt-8">{navLinks}</nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-6 px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors touch-manipulation"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
