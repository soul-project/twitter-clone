import axios from "axios";
import { Session } from "next-auth";

export const getMyConnections = async ({
  session,
  page = 1,
  numItemsPerPage = 100,
}: getMyConnectionsArgs) => {
  const { data: userConnectionsData } =
    await axios.get<UserConnectionsListData>(
      "https://api.soul-network.com/v1/user-connections/my-connections",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          page,
          num_items_per_page: numItemsPerPage,
          connection_type: "follow",
        },
      }
    );
  return {
    userConnections: userConnectionsData.user_connections.map(
      (userConnection) => ({
        id: userConnection.to_user.id,
        username: userConnection.to_user.username,
        userHandle: userConnection.to_user.user_handle,
      })
    ),
    totalCount: userConnectionsData.total_count,
  };
};

getMyConnections.key = "modules/users/getMyConnections";

type UserConnectionsData = {
  to_user: {
    id: number;
    username: string;
    user_handle: string;
  };
};

type UserConnectionsListData = {
  user_connections: UserConnectionsData[];
  total_count: number;
};

type getMyConnectionsArgs = {
  page?: number;
  numItemsPerPage?: number;
  session: Session;
};
