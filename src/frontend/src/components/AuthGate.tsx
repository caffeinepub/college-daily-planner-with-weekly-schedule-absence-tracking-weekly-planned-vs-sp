import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Smartphone } from 'lucide-react';
import { isNativeApp } from '../utils/isNativeApp';

export default function AuthGate() {
  const { login, loginStatus, loginError } = useInternetIdentity();
  const isNative = isNativeApp();

  const isLoggingIn = loginStatus === 'logging-in';
  const hasError = loginStatus === 'loginError';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      // Error is already handled by the hook
      console.error('Login failed:', error);
    }
  };

  // Context-appropriate error messages
  const getErrorMessage = () => {
    if (!loginError) return null;

    if (loginError.message === 'User is already authenticated') {
      return isNative
        ? 'You are already signed in. Please restart the app if you continue to see this message.'
        : 'You are already signed in. Please refresh the page.';
    }

    // Generic error for native app
    if (isNative) {
      return 'Sign-in failed. Please ensure you have a stable internet connection and try again. If the problem persists, try restarting the app.';
    }

    // Browser-specific guidance
    return 'Sign-in failed. Please allow pop-ups for this site and try again. If the problem persists, try using a different browser.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/planner-logo.dim_512x512.png"
              alt="College Planner"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">College Planner</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              Organize your schedule, track hours, and stay on top of your studies
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasError && loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {getErrorMessage()}
              </AlertDescription>
            </Alert>
          )}
          
          {isNative && !hasError && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You'll be redirected to complete sign-in. Return to this app after authentication.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-medium touch-manipulation"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in to get started'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground px-2">
            Secure authentication powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
