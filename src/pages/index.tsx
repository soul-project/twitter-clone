import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";

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

  // const postSomethingNew = async () => {
  //   await fetch("/api/posts", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       body: "general Kenobiii!",
  //     }),
  //   });
  // };

  return (
    <>
      <Head />
      <Page>
        <VStack marginTop="32px">
          {/* <Button onClick={postSomethingNew}>Post something</Button> */}
          <NewPostForm />
          <VStack spacing="16px" w="100%">
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
