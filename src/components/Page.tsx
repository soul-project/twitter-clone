import { Box, Center, HStack, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import PageTitle from "./Page/PageTitle";
import Sidebar from "./Page/Sidebar";

export default function Page({ children, title, ...props }: Props) {
  return (
    <main>
      <Center>
        <HStack alignItems="flex-start" m="0px auto">
          <Sidebar />
          <Box
            minHeight="100vh"
            maxW="600px"
            w={["auto", "auto", "auto", "600px"]}
            {...props}
          >
            <PageTitle title={title} />
            {children}
          </Box>
        </HStack>
      </Center>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
  title: string;
} & React.ComponentProps<typeof Box>;
