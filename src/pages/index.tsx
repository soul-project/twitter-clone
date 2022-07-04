import { useEffect } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";
import CreateNewPostForm from "src/components/CreateNewPostForm";
import PostFeed from "src/components/PostFeed";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
}

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  return (
    <>
      <Head />
      <Page
        borderLeft="1px solid white"
        borderRight="1px solid white"
        paddingTop="32px"
        title="Home"
      >
        <VStack alignItems="flex-start" spacing="0px">
          <CreateNewPostForm />
          <PostFeed />
        </VStack>
      </Page>
    </>
  );
};

export default Home;
