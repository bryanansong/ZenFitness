import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export { hashPassword, comparePassword };
