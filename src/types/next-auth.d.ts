import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "SUPER_ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "USER" | "SUPER_ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: "USER" | "SUPER_ADMIN";
  }
}
