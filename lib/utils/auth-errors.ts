// Error types enum for better type safety
export enum AuthErrorType {
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Structured error response interface
export interface AuthErrorResponse {
  type: AuthErrorType;
  message: string;
  title: string;
}

// Error message mapping
const ERROR_MESSAGES: Record<AuthErrorType, AuthErrorResponse> = {
  [AuthErrorType.EMAIL_EXISTS]: {
    type: AuthErrorType.EMAIL_EXISTS,
    title: 'Email Already Registered',
    message: 'This email is already registered. Please sign in instead.'
  },
  [AuthErrorType.INVALID_EMAIL]: {
    type: AuthErrorType.INVALID_EMAIL,
    title: 'Invalid Email',
    message: 'Please enter a valid email address.'
  },
  [AuthErrorType.WEAK_PASSWORD]: {
    type: AuthErrorType.WEAK_PASSWORD,
    title: 'Weak Password',
    message: 'Password must be at least 8 characters long.'
  },
  [AuthErrorType.INCORRECT_PASSWORD]: {
    type: AuthErrorType.INCORRECT_PASSWORD,
    title: 'Incorrect Password',
    message: 'Incorrect password. Please try again.'
  },
  [AuthErrorType.USER_NOT_FOUND]: {
    type: AuthErrorType.USER_NOT_FOUND,
    title: 'Account Not Found',
    message: 'No account found with this email. Please sign up first.'
  },
  [AuthErrorType.NETWORK_ERROR]: {
    type: AuthErrorType.NETWORK_ERROR,
    title: 'Network Error',
    message: 'Network error. Please check your connection and try again.'
  },
  [AuthErrorType.VALIDATION_ERROR]: {
    type: AuthErrorType.VALIDATION_ERROR,
    title: 'Validation Error',
    message: 'Please check your input and try again.'
  },
  [AuthErrorType.UNKNOWN_ERROR]: {
    type: AuthErrorType.UNKNOWN_ERROR,
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again later.'
  }
};

// Main error parsing function
export function parseAuthError(error: unknown, context: 'signup' | 'signin'): AuthErrorResponse {
  // Handle Error objects
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (errorMessage.includes('email') && (errorMessage.includes('exist') || errorMessage.includes('already'))) {
      return ERROR_MESSAGES[AuthErrorType.EMAIL_EXISTS];
    }
    
    if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
      return ERROR_MESSAGES[AuthErrorType.INVALID_EMAIL];
    }
    
    if (errorMessage.includes('password') && (errorMessage.includes('weak') || errorMessage.includes('short'))) {
      return ERROR_MESSAGES[AuthErrorType.WEAK_PASSWORD];
    }
    
    if (errorMessage.includes('password') && (errorMessage.includes('incorrect') || errorMessage.includes('wrong'))) {
      return ERROR_MESSAGES[AuthErrorType.INCORRECT_PASSWORD];
    }
    
    if (errorMessage.includes('user') && errorMessage.includes('not found')) {
      return ERROR_MESSAGES[AuthErrorType.USER_NOT_FOUND];
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return ERROR_MESSAGES[AuthErrorType.NETWORK_ERROR];
    }
  }
  
  // Handle Better Auth specific error responses
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    // Check for Better Auth error structure
    if (errorObj.error || errorObj.message) {
      const errorText = (errorObj.error || errorObj.message).toLowerCase();
      
      if (errorText.includes('email already exists') || errorText.includes('user already exists')) {
        return ERROR_MESSAGES[AuthErrorType.EMAIL_EXISTS];
      }
      
      if (errorText.includes('invalid credentials') || errorText.includes('incorrect password')) {
        return ERROR_MESSAGES[AuthErrorType.INCORRECT_PASSWORD];
      }
      
      if (errorText.includes('user not found') || errorText.includes('no user found')) {
        return ERROR_MESSAGES[AuthErrorType.USER_NOT_FOUND];
      }
      
      if (errorText.includes('invalid email')) {
        return ERROR_MESSAGES[AuthErrorType.INVALID_EMAIL];
      }
      
      if (errorText.includes('password') && (errorText.includes('weak') || errorText.includes('short') || errorText.includes('minimum'))) {
        return ERROR_MESSAGES[AuthErrorType.WEAK_PASSWORD];
      }
    }
  }
  
  // Default error based on context
  if (context === 'signup') {
    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      title: 'Sign Up Failed',
      message: 'Failed to create account. Please try again later.'
    };
  } else {
    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      title: 'Login Failed',
      message: 'Failed to sign in. Please try again later.'
    };
  }
}
