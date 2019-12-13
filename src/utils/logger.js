import winston from "winston";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const colorizedFormat = format.colorize({
  colors: {
    info: "white italic",
    debug: "green bold",
    error: "black bgRed italic"
  },
  all: true
});

const timestampFormat = "YYYY-MM-DD HH:mm:ss.SSS";

const isProductionEnv =
  process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";

const createConsoleTransport = () => {
  return new transports.Console({
    format: combine(colorizedFormat, myFormat, timestamp()),
    level: "debug"
  });
};

const createTransports = () => {
  const transportArray = [
    new transports.File({ filename: "log/error.log", level: "error" })
  ];
  if (isProductionEnv) {
    return transportArray;
  }
  transportArray.push(
    new transports.File({ filename: "log/combined.log", level: "debug" })
  );
  transportArray.push(createConsoleTransport());
  return transportArray;
};

const createExceptionHandlers = () => {
  const transportArray = [
    new transports.File({ filename: "log/exceptions.log" })
  ];
  if (isProductionEnv) {
    return transportArray;
  }
  transportArray.push(createConsoleTransport());
  return transportArray;
};

const logger = createLogger({
  format: combine(
    label({ label: "default-application" }),
    timestamp({ format: timestampFormat }),
    myFormat
  ),
  transports: createTransports(),
  exceptionHandlers: createExceptionHandlers(),
  exitOnError: false
});

const initializeLogger = providedLabel => {
  logger.log("info", "initializing logger");
  logger.format = combine(
    label({ label: providedLabel }),
    timestamp({ format: timestampFormat }),
    myFormat
  );
  logger.log("info", `Update logger for ${providedLabel}`);
  logger.log("debug", "test debug");
  logger.log("error", "test error");
  return logger;
};

export { initializeLogger };