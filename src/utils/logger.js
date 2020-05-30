import winston from "winston";
import { MongoDB } from "winston-mongodb";

import { format as logformFormat } from "logform";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

let messageId = undefined;

const myFormat = printf(({ level, message, label, timestamp }) => {
  message = `${timestamp} ${messageId} [${label}] ${level} : ${message}`;
  return message;
});

const colorizedFormat = format.colorize({
  colors: {
    info: "white italic",
    debug: "yellow italic",
    error: "white bgRed italic"
  },
  all: true
});

const timestampFormat = "YYYY-MM-DD HH:mm:ss.SSS";

const isProductionEnv =
  process.env.ENV === "prod" || process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";

const createConsoleTransport = () => {
  return new transports.Console({
    format: combine(colorizedFormat, myFormat, timestamp()),
    level: "debug"
  });
};

const createTransports = providedLabel => {
  const transportArray = [
    new transports.File({ filename: "log/error.log", level: "error" })
  ];
  transportArray.push(
    new transports.File({ filename: "log/combined.log", level: "debug" })
  );
  if (isProductionEnv) {
    return transportArray;
  }


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

const initializeLogger = providedLabel => {
  const logger = createLogger({
    format: combine(
      label({ label: "default-application" }),
      timestamp({ format: timestampFormat }),
      myFormat
    ),
    transports: createTransports(providedLabel),
    exceptionHandlers: createExceptionHandlers(),
    exitOnError: false
  });
  logger.format = combine(
    label({ label: providedLabel }),
    timestamp({ format: timestampFormat }),
    myFormat
  );

  logger.debug = (message, obj) => {
    logger.log("debug", message, { meta: { ...obj, messageId  } });
  }

  logger.error = (message, obj) => {
    logger.log("error", message, { meta: { error: { ...obj }, messageId } });
  }
  return logger;
};

const setMessageId = sId => {
  messageId = sId;
}

const getMessageId = ()=> {
  return messageId;
}

export { initializeLogger, setMessageId, getMessageId };