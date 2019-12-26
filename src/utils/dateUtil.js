const options = {
  timeZone: "Australia/Sydney",
  hour12: false,
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
};

const localeDate = new Date().toLocaleDateString("en-AU", options);

export default localeDate;
