import { Box, Center, HStack } from "@chakra-ui/react";
import React from "react";

import Sidebar from "./Sidebar";

export default function Page({ children, ...props }: Props) {
  return (
    <main>
      <Center>
        <HStack alignItems="flex-start" m="0px auto">
          <Sidebar />
          <Box minHeight="100vh" width="600px" {...props}>
            {children}
          </Box>
        </HStack>
      </Center>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Box>;
