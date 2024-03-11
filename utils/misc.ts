import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

interface JWTPayload {
  [key: string]: any;
}

const signJWT = (data: JWTPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET env variable not defined");
  }

  return jwt.sign(data, process.env.JWT_SECRET);
};

const verifyJWT = (token: string): JWTPayload | null => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
};

const saltRounds = Number(process.env.SALT_ROUNDS);

const generateHash = async (input: string): Promise<string> => {
  try {
    const hash: string = await bcrypt.hash(input, saltRounds);
    return hash;
  } catch (error) {
    console.error("Error generating hash:", error);
    throw error;
  }
};

const comparePassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  try {
    const match: boolean = await bcrypt.compare(plainPassword, hash);
    return match;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

export { signJWT, verifyJWT, generateHash, comparePassword };
