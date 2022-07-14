import { useEffect } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "react-query";

import Head from "src/components/Head";
import Page from "src/components/Page";
import CreateNewPostForm from "src/components/CreateNewPostForm";
import PostFeed from "src/components/PostFeed";
import { getPostRepository, syncCouchDBForPost } from "src/modules/api/utils";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  const queryClient = new QueryClient();

  await getPostRepository();
  await syncCouchDBForPost({ cursor: new Date().getTime(), limit: 10 });

  return {
    props: { session, dehydratedState: dehydrate(queryClient) },
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
