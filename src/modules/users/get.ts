import axios from "axios";

export const get = async (userId: number) => {
  const { data: userData } = await axios.get<UserData>(
    `https://api.soul-network.com/v1/users/${userId}`
  );
  return {
    id: userData.id,
    username: userData.username,
    userHandle: userData.user_handle,
  };
};

get.key = "modules/users/get";

type UserData = {
  id: number;
  user_handle: string;
  username: string;
};
