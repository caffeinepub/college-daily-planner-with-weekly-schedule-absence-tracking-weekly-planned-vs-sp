/**
 * Utility to detect if the app is running inside a native wrapper (Capacitor)
 * vs. a standard mobile browser.
 */

export function isNativeApp(): boolean {
  // Check for Capacitor
  if (typeof window !== 'undefined') {
    // Capacitor adds a global Capacitor object
    const capacitor = (window as any).Capacitor;
    if (capacitor && capacitor.isNativePlatform && capacitor.isNativePlatform()) {
      return true;
    }
    
    // Additional check: Capacitor uses custom schemes
    if (window.location.protocol === 'capacitor:') {
      return true;
    }
    
    // Check for Android WebView user agent
    const userAgent = navigator.userAgent || '';
    if (userAgent.includes('wv') && userAgent.includes('Android')) {
      return true;
    }
  }
  
  return false;
}

export function getPlatform(): 'android' | 'ios' | 'web' {
  if (typeof window === 'undefined') return 'web';
  
  const capacitor = (window as any).Capacitor;
  if (capacitor && capacitor.getPlatform) {
    const platform = capacitor.getPlatform();
    if (platform === 'android' || platform === 'ios') {
      return platform;
    }
  }
  
  return 'web';
}
