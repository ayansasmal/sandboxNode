import jwt from "jsonwebtoken";

const getToken = (data, isSigned) => {
  return jwt.sign(data, "ayansasmalisthecreatorofappli");
};

export default { getToken };
