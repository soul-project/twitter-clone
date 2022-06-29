import { useEffect } from "react";
import type { NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Button, VStack } from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";
import Footer from "src/components/Footer";

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/posts");
      const json = await res.json();
      console.log("🚀 ~ file: index.tsx ~ line 30 ~ fetchData ~ json", json);
    };
    session && fetchData();
  }, [session]);

  const postSomethingNew = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Hello there~",
        body: "general Kenobiii!",
      }),
    });
  };

  return (
    <>
      <Head />
      <Page>
        <VStack marginTop="32px">
          <Button onClick={postSomethingNew}>Post something</Button>
        </VStack>
      </Page>
    </>
  );
};

export default Home;
