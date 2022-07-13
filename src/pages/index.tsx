import { useEffect } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "react-query";

import Head from "src/components/Head";
import Page from "src/components/Page";
import CreateNewPostForm from "src/components/CreateNewPostForm";
import PostFeed from "src/components/PostFeed";
// import { getList } from "src/modules/posts/getList";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  const queryClient = new QueryClient();

  // TODO: Figure out how to get this to work
  // await queryClient.prefetchInfiniteQuery(
  //   [getList.key, { userId: undefined }],
  //   () => getList({ page: 1 })
  // );

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
