import { Box, HStack } from "@chakra-ui/react";
import React from "react";

import PageTitle from "./Page/PageTitle";
import Sidebar from "./Page/Sidebar";

export default function Page({ children, title, ...props }: Props) {
  return (
    <main>
      <HStack
        alignItems="flex-start"
        justifyContent="center"
        w={["100vw", "100vw", "100vw", "auto"]}
        spacing="0px"
      >
        <Sidebar display={["none", "block"]} />
        <Box
          minHeight="100vh"
          maxW="600px"
          minW="0px"
          w="100%"
          flexGrow={1}
          borderLeft={["none", "1px solid white"]}
          borderRight={["none", "1px solid white"]}
          paddingTop="32px"
          {...props}
        >
          <PageTitle title={title} />
          {children}
        </Box>
      </HStack>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
  title: string;
} & React.ComponentProps<typeof Box>;
