import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import Head from "src/components/Head";
import Page from "src/components/Page";
import ConnectionsList from "src/components/ConnectionsList";

const Following = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }

    if (status === "unauthenticated") router.push("/");
  }, [router, session, status]);

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
