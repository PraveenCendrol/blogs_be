class AppError extends Error {
  [x: string]: any;
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;

    // Reassigning the name property to match the class name
    Object.defineProperty(this, "name", {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
    });

    // Capturing the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
