import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../utils/helpers.js";

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        userInterests: {
          create: {
            activityScore: 0,
            lastWorkoutDate: new Date(),
          },
        },
      },
      include: {
        userInterests: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).json({ error: "Unable to create user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { userId: user.id, username: user.username } });
  } catch (error) {
    res.status(400).json({ error: "Unable to log in" });
  }
};

export { login, signup };
