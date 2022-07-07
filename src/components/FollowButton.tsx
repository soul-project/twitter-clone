import { Button } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Session } from "next-auth";

import { destroy } from "src/modules/userConnections/destroy";
import { create } from "src/modules/userConnections/create";
import { getConnectionByUsers } from "src/modules/userConnections/getConnectionByUsers";

export default function FollowButton({ userId, session }: Props) {
  const queryClient = useQueryClient();

  const getUserConnectionByUserIdArgs = {
    fromUserId: session.user.id,
    toUserId: userId,
  };
  const { data: userConnectionData, isFetching: isFetchingFollowStatus } =
    useQuery(
      [getConnectionByUsers.key, getUserConnectionByUserIdArgs],
      () => getConnectionByUsers(getUserConnectionByUserIdArgs),
      {
        enabled: !!session && session.user.id !== userId,
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: destroyConnection, isLoading: isLoadingDestroyConnection } =
    useMutation(async () => {
      await destroy({
        userConnectionId: userConnectionData!.id,
        session: session!,
      });
      await queryClient.invalidateQueries([
        getConnectionByUsers.key,
        getUserConnectionByUserIdArgs,
      ]);
    });

  const { mutate: createConnection, isLoading: isLoadingCreateConnection } =
    useMutation(async () => {
      await create({
        fromUserId: session.user.id,
        toUserId: userId,
        session: session!,
      });
      await queryClient.invalidateQueries([
        getConnectionByUsers.key,
        getUserConnectionByUserIdArgs,
      ]);
    });

  return (
    <Button
      onClick={() =>
        userConnectionData !== null ? destroyConnection() : createConnection()
      }
      isLoading={
        isLoadingDestroyConnection ||
        isLoadingCreateConnection ||
        isFetchingFollowStatus
      }
    >
      {userConnectionData === null ? "Follow" : "Following"}
    </Button>
  );
}

type Props = {
  userId: number;
  session: Session;
};
