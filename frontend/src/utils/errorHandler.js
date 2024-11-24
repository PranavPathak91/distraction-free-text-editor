class ErrorHandler {
  constructor() {
    this.errorTypes = {
      VALIDATION_ERROR: 'Validation Error',
      NETWORK_ERROR: 'Network Error',
      STORAGE_ERROR: 'Storage Error',
      PERMISSION_ERROR: 'Permission Error',
      UNKNOWN_ERROR: 'Unknown Error'
    };
  }

  // Centralized error logging
  log(error, context = {}) {
    const errorLog = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context
    };

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportToErrorService(errorLog);
    }

    // Console logging for development
    console.error('Application Error:', errorLog);

    return errorLog;
  }

  // Create standardized error response
  createError(type, message, details = {}) {
    return {
      type: this.errorTypes[type] || this.errorTypes.UNKNOWN_ERROR,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  // Validation error handler
  handleValidationError(errors) {
    return this.createError(
      'VALIDATION_ERROR', 
      'Validation failed', 
      { validationErrors: errors }
    );
  }

  // Network error handler
  handleNetworkError(error) {
    return this.createError(
      'NETWORK_ERROR', 
      'Network request failed', 
      { 
        originalError: error.message,
        status: error.status 
      }
    );
  }

  // Storage error handler
  handleStorageError(error) {
    return this.createError(
      'STORAGE_ERROR', 
      'Data storage operation failed', 
      { originalError: error.message }
    );
  }

  // Error tracking service (mock implementation)
  reportToErrorService(errorLog) {
    // In a real-world scenario, integrate with services like Sentry, LogRocket, etc.
    // This is a placeholder for external error reporting
    try {
      // Simulated error reporting
      fetch('/api/error-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorLog)
      }).catch(console.error);
    } catch (reportError) {
      console.error('Error reporting failed', reportError);
    }
  }

  // Global error boundary handler
  globalErrorHandler = (error, info) => {
    const errorLog = this.log(error, { componentStack: info });
    
    // Optionally show user-friendly error modal
    this.showErrorModal(errorLog);

    return errorLog;
  }

  // User-friendly error modal
  showErrorModal(errorLog) {
    // In a real app, this would be a React modal or toast notification
    alert(`An error occurred: ${errorLog.message}`);
  }
}

export default new ErrorHandler();
