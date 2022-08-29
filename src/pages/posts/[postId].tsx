import { useEffect } from "react";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { VStack, Text, Center } from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";

export async function getServerSideProps(ctx: any) {
  const postId = ctx.params.postId;

  if (!postId) throw new Error("Invalid postId");
  return {
    props: { postId },
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
