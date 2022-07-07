import axios from "axios";
import { Session } from "next-auth";

export const create = async ({ fromUserId, toUserId, session }: CreateArgs) => {
  await axios.post(
    "https://api.soul-network.com/v1/user-connections",
    { from_user_id: fromUserId, to_user_id: toUserId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );
};

type CreateArgs = {
  fromUserId: number;
  toUserId: number;
  session: Session;
};
