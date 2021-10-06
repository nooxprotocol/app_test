import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const logDir = './logs';
const { combine, colorize, timestamp, printf } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  if (stack) {
    return `${timestamp} ${level} - ${message}\n${stack}`;
  } else {
    return `${timestamp} ${level} - ${message}`;
  }
});

export const logger = winston.createLogger({
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'HH:mm:ss.SSS',
    }),
    logFormat,
  ),
  transports: [
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `app.%DATE%.log`,
      maxFiles: 10,
      zippedArchive: false,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `error.%DATE%.log`,
      maxFiles: 30,
      zippedArchive: false,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(colorize({ all: true })),
    }),
  );
}
