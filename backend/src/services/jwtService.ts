import jwt from "jsonwebtoken";

export function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
