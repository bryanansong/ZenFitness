import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

const calculateDaysSinceLastWorkout = (userInterest) => {
  return Math.floor(
    (Date.now() - userInterest.lastWorkoutDate.getTime()) / (1000 * 3600 * 24)
  );
};

export { prisma, hashPassword, comparePassword, calculateDaysSinceLastWorkout };
