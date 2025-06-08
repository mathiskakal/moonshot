// Custom Error Classes and Error Handling Utilities
/*
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public sql?: string,
    public context?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      sql: this.sql,
      context: this.context,
      stack: this.stack
    };
  }
}

export function handleDatabaseError(error: unknown, context: string): never {
  console.error(`Database error in ${context}:`, error);
  
  if (error instanceof DatabaseError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new DatabaseError(
      `Unexpected error in ${context}: ${error.message}`,
      'UNEXPECTED_ERROR',
      undefined,
      { originalError: error.message, context }
    );
  }
    throw new DatabaseError(
    `Unknown error in ${context}`,
    'UNKNOWN_ERROR',
    undefined,
    { context }
  );
}


// Helper function to safely extract error message from unknown error types
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
*/