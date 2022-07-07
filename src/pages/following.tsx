import { useEffect } from "react";
import type { NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { VStack } from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";
import FollowingList from "src/components/FollowingList";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  return {
    props: { session },
  };
}

const Following: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  return (
    <>
      <Head />
      <Page title="Following">
        <VStack alignItems="flex-start" spacing="0px" w="100%">
          <FollowingList />
        </VStack>
      </Page>
    </>
  );
};

export default Following;
