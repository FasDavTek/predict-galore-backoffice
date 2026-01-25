/**
 * CENTRALIZED LOGGER
 * 
 * Unified logging utility with:
 * - Different log levels (info, warn, error, debug)
 * - Development/production modes
 * - Structured logging
 * - Optional context
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: unknown;
}

class Logger {
  private context: string;
  private isDevelopment: boolean;

  constructor(context: string) {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${this.context}]`;
    
    if (data && Object.keys(data).length > 0) {
      return `${prefix} ${message} | ${JSON.stringify(data)} | ${timestamp}`;
    }
    
    return `${prefix} ${message} | ${timestamp}`;
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    const formattedMessage = this.formatMessage(level, message, data);

    switch (level) {
      case 'error':
        // Only log errors in development, or if explicitly enabled
        if (this.isDevelopment) {
          console.error(formattedMessage, data || '');
        } else {
          // In production, silently log or send to error tracking service
          // You can integrate with services like Sentry, LogRocket, etc. here
        }
        break;
      case 'warn':
        if (this.isDevelopment) {
          console.warn(formattedMessage, data || '');
        }
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage, data || '');
        }
        break;
      case 'info':
      default:
        if (this.isDevelopment) {
          console.log(formattedMessage, data || '');
        }
        break;
    }
  }

  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }
}

/**
 * Create a logger instance with a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Default logger instance
 */
export const logger = createLogger('App');

