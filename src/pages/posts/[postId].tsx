import { useEffect } from "react";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { VStack, Text, Center } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "react-query";
import { unstable_getServerSession } from "next-auth";

import Head from "src/components/Head";
import Page from "src/components/Page";

import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(ctx: any) {
  const queryClient = new QueryClient();
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  return {
    props: {
      session: session ? { ...session, error: session.error ?? null } : null,
      postId: ctx.params.postId,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Post: NextPage<Props> = ({ postId }) => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  return (
    <>
      <Head />
      <Page title="Post">
        <VStack alignItems="flex-start" spacing="0px" w="100%">
          {/* TODO: Implement this page */}
          <Center w="100%">
            <Text>{postId}</Text>
          </Center>
        </VStack>
      </Page>
    </>
  );
};

export default Post;

type Props = {
  postId: number;
};
