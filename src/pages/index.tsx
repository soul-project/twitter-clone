import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "react-query";
import { unstable_getServerSession } from "next-auth";

import Head from "src/components/Head";
import Page from "src/components/Page";
import CreateNewPostForm from "src/components/CreateNewPostForm";
import PostFeed from "src/components/PostFeed";

import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(ctx: any) {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );
  const queryClient = new QueryClient();

  return {
    props: {
      session: session ? { ...session, error: session.error ?? null } : null,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  return (
    <>
      <Head />
      <Page title="Home">
        <VStack alignItems="flex-start" spacing="0px" w="100%">
          <CreateNewPostForm />
          <PostFeed />
        </VStack>
      </Page>
    </>
  );
};

export default Home;
