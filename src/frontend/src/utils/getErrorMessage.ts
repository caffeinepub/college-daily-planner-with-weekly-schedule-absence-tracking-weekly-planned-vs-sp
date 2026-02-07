/**
 * Normalizes unknown thrown values (Error, agent errors, strings, objects) 
 * into a readable English message suitable for toast display.
 */
export function getErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle agent errors with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  // Handle objects with error_description (some IC agent errors)
  if (error && typeof error === 'object' && 'error_description' in error) {
    const description = (error as { error_description: unknown }).error_description;
    if (typeof description === 'string') {
      return description;
    }
  }

  // Fallback: try to stringify the error
  try {
    const stringified = JSON.stringify(error);
    if (stringified && stringified !== '{}') {
      return stringified;
    }
  } catch {
    // JSON.stringify failed, continue to default
  }

  // Default fallback
  return 'An unknown error occurred';
}
