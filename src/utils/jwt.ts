import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";

export const sign = (payload: JwtUserPayload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

export const verify = (token: string): JwtUserPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
};
