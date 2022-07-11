import { useEffect } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import {
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Head from "src/components/Head";
import Page from "src/components/Page";
import ConnectionsList from "src/components/ConnectionsList";

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

const Following = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  return (
    <>
      <Head />
      <Page title="My Connections">
        <Tabs>
          <TabList>
            <Tab>Following</Tab>
            <Tab>Followers</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack alignItems="flex-start" spacing="0px" w="100%">
                <ConnectionsList connectionType="following" />
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack alignItems="flex-start" spacing="0px" w="100%">
                <ConnectionsList connectionType="follower" />
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Page>
    </>
  );
};

export default Following;
