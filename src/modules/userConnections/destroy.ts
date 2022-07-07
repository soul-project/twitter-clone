import axios from "axios";
import { Session } from "next-auth";

export const destroy = async ({ userConnectionId, session }: DestroyArgs) => {
  await axios.delete(
    `https://api.soul-network.com/v1/user-connections/${userConnectionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );
};

type DestroyArgs = {
  userConnectionId: number;
  session: Session;
};
