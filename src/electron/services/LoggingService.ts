import { createRequire } from 'module';
import { isDev } from '../utils/mainUtils.js';

const require = createRequire(import.meta.url);
const pino = require('pino');

// Ultra-simple logger - just console replacement for now
export const logger = pino({
  level: isDev() ? 'debug' : 'info',
  
  // Pretty print only in development
  transport: isDev() ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname'
    }
  } : undefined
});

// Simple function to create module-specific loggers
export const createLogger = (module: string) => {
  return logger.child({ module });
};
