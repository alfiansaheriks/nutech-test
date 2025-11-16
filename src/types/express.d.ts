import type { JwtUserPayload } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user: JwtUserPayload;
    }
  }
}
