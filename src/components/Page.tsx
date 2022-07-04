import { Box, Center, HStack, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
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
      >
        <Sidebar />
        <Box minHeight="100vh" maxW="600px" flexGrow={2} {...props}>
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
