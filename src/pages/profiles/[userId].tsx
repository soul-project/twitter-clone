import { useEffect } from "react";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { HStack, VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { unstable_getServerSession } from "next-auth";

import PostFeed from "src/components/PostFeed";
import Head from "src/components/Head";
import Page from "src/components/Page";
import { get } from "src/modules/users/get";
import FollowButton from "src/components/FollowButton";

import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(ctx: any) {
  const queryClient = new QueryClient();
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  const userId = parseInt(ctx.params.userId);

  if (isNaN(userId)) throw new Error("Invalid userId");

  await queryClient.prefetchQuery([get.key, userId], () => get(userId));
  return {
    props: {
      session: session ? { ...session, error: session.error ?? null } : null,
      userId,
      dehydratedState: dehydrate(queryClient),
    },
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
      <Page title={userData!.userHandle}>
        {session && userId !== session.user.id ? (
          <HStack
            w="100%"
            padding="16px"
            justifyContent={["flex-start", "flex-end"]}
          >
            <FollowButton userId={userId} session={session!} />
          </HStack>
        ) : null}
        <VStack alignItems="flex-start" spacing="0px" w="100%">
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
