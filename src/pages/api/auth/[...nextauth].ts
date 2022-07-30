import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";

const CLIENT_ID = process.env.SOUL_PLATFORM_ID;

const getNewTokenFromServer = async (
  refreshToken: string
): Promise<{
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}> => {
  const url = "https://api.soul-network.com/v1/auth/refresh";
  const { data } = await axios.post<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }>(
    url,
    {
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  };
};

const getTokenWithLatestUserInfo = async (token: JWT): Promise<JWT> => {
  try {
    const { data: user } = await axios.get<{
      id: number;
      username: string;
      user_handle: string;
      email: string;
      is_active: boolean;
    }>("https://api.soul-network.com/v1/users/me", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    return {
      ...token,
      user: {
        id: user.id,
        username: user.username,
        userHandle: user.user_handle,
        email: user.email,
        isActive: user.is_active,
      },
    };
  } catch (_err) {
    return token;
  }
};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const refreshedTokens = await getNewTokenFromServer(token.refreshToken);
    const expiresAt = Date.now() + refreshedTokens.expiresIn * 1000;

    const newToken = {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: expiresAt,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };

    return newToken;
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: "soul",
      name: "Soul",
      type: "oauth",
      authorization: "https://login.soul-network.com",
      token: "https://api.soul-network.com/v1/auth/verify",
      userinfo: "https://api.soul-network.com/v1/users/me",
      checks: ["pkce", "state"],
      clientId: String(CLIENT_ID),
      clientSecret: "secret",
      profile: (profile) => {
        return {
          id: profile.id,
          email: profile.email,
          isActive: profile.is_active,
          username: profile.username,
          userHandle: profile.user_handle,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const expiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 900 * 1000;

        return {
          account,
          accessToken: account.access_token,
          accessTokenExpires: expiresAt,
          refreshToken: account.refresh_token,
          user,
        } as JWT;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return getTokenWithLatestUserInfo(token);
      }

      // Access token has expired, try to update it
      return getTokenWithLatestUserInfo(await refreshAccessToken(token));
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken as string;
      session.error = token.error;

      return session;
    },
  },
};

export default NextAuth(authOptions);
