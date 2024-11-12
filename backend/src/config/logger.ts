import { createLogger, format, transports } from "winston";
import path from "path";

// Define custom format for more readable logs
const customFormat = format.printf(({ level, message, timestamp, stack, ...meta }) => {
  // Conditionally include meta information if it exists
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `${timestamp} [${level}]: ${message} ${stack ? `\nStack: ${stack}` : ""} ${metaString}`;
});

// Create the Winston logger instance
const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // Log stack traces for errors
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), customFormat) // Colorized output for console
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error", // Only log errors to error.log
      format: format.combine(format.timestamp(), customFormat)
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
      format: format.combine(format.timestamp(), customFormat)
    })
  ]
});

export default logger;
