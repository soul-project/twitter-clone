import axios from "axios";
import { StatusCodes } from "http-status-codes";

export const getConnectionByUsers = async ({
  fromUserId,
  toUserId,
}: getUserConnectionByUsersArgs) => {
  try {
    const { data: userConnectionData } = await axios.get<UserConnectionsData>(
      "https://api.soul-network.com/v1/user-connections/by-users",
      {
        params: {
          from_user_id: fromUserId,
          to_user_id: toUserId,
        },
      }
    );
    return {
      id: userConnectionData.id,
      user: {
        id: userConnectionData.to_user.id,
        username: userConnectionData.to_user.username,
        userHandle: userConnectionData.to_user.user_handle,
      },
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === StatusCodes.NOT_FOUND
    ) {
      return null;
    }
    throw error;
  }
};

getConnectionByUsers.key = "modules/users/getConnectionByUsers";

type UserConnectionsData = {
  id: number;
  to_user: {
    id: number;
    username: string;
    user_handle: string;
  };
};

type getUserConnectionByUsersArgs = {
  fromUserId: number;
  toUserId: number;
};
