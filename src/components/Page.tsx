import { Box } from "@chakra-ui/react";
import React from "react";
import Sidebar from "./Sidebar";

export default function Page({ children, ...props }: Props) {
  return (
    <main>
      <Box minHeight="100vh" padding="0px 64px" {...props}>
        {children}
      </Box>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Box>;
