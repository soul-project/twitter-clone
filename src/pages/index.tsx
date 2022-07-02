import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack, Text, Box } from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";
import PostCard from "src/components/PostCard";
import { getList, Post } from "src/modules/posts/getList";
import NewPostForm from "src/components/NewPostForm";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
}

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const { posts } = await getList();
      setPosts(posts);
    };
    session && fetchData();
  }, [session]);

  return (
    <>
      <Head />
      <Page
        borderLeft="1px solid white"
        borderRight="1px solid white"
        paddingTop="32px"
      >
        <VStack alignItems="flex-start" spacing="0px">
          {/* <PageTitle /> */}
          <NewPostForm />
          <VStack w="100%" spacing="0px">
            {posts.map((post) => (
              <PostCard key={post.entityId} post={post} />
            ))}
          </VStack>
        </VStack>
      </Page>
    </>
  );
};

export default Home;
