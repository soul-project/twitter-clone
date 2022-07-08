import axios from "axios";
import { Session } from "next-auth";

export const create = async ({ toUserId, session }: CreateArgs) => {
  await axios.post(
    "https://api.soul-network.com/v1/user-connections",
    { from_user_id: session.user.id, to_user_id: toUserId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );
};

type CreateArgs = {
  toUserId: number;
  session: Session;
};
