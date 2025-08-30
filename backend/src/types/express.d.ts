// Tell TS that Express.Request has a "user" we attach in auth middleware
import type { Types } from "mongoose";

declare global {
  namespace Express {
    type UserRole = "buyer" | "seller" | "admin";

    interface AuthUser {
      _id: Types.ObjectId | string;
      email?: string;
      role: UserRole;
    }

    interface Request {
      user: AuthUser; // <-- now req.user is known everywhere
    }
  }
}

export {}; // make this a module