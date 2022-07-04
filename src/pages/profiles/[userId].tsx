import { useEffect } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import PostFeed from "src/components/PostFeed";
import Head from "src/components/Head";
import Page from "src/components/Page";
import { get } from "src/modules/users/get";

export async function getServerSideProps(ctx: any) {
  const queryClient = new QueryClient();
  const session = await getSession(ctx);
  const userId = parseInt(ctx.params.userId);

  if (isNaN(userId)) throw new Error("Invalid userId");

  await queryClient.prefetchQuery([get.key, userId], () => get(userId));

  return {
    props: { session, userId, dehydratedState: dehydrate(queryClient) },
  };
}

const Profile: NextPage<Props> = ({ userId }) => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);
  const { data: userData } = useQuery([get.key, userId], () => get(userId));

  return (
    <>
      <Head />
      <Page
        borderLeft="1px solid white"
        borderRight="1px solid white"
        paddingTop="32px"
        title={userData!.userHandle}
      >
        <VStack alignItems="flex-start" spacing="0px">
          <PostFeed userId={userId} />
        </VStack>
      </Page>
    </>
  );
};

export default Profile;

type Props = {
  userId: number;
};
