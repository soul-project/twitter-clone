import { useEffect } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import PostFeed from "src/components/PostFeed";
import Head from "src/components/Head";
import Page from "src/components/Page";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
}

const Profile: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { userId: rawUserId } = router.query;

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  const userId = parseInt(rawUserId as string);

  return (
    <>
      <Head />
      <Page
        borderLeft="1px solid white"
        borderRight="1px solid white"
        paddingTop="32px"
      >
        <VStack alignItems="flex-start" spacing="0px">
          {/* TODO: Set title according to the name of the user */}
          {/* <PageTitle /> */}
          {!isNaN(userId) && <PostFeed userId={userId} />}
        </VStack>
      </Page>
    </>
  );
};

export default Profile;
