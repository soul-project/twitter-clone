import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

interface SoulUser {
  id: number;
  email: string;
  isActive: boolean;
  username: string;
  userHandle: string;
}

declare module "next-auth" {
  interface Session {
    user: SoulUser;
    accessToken: string;
  }

  interface Profile extends SoulUser {}

  interface User extends SoulUser {
    id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: SoulUser;
    account: {
      expires_at: number;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
