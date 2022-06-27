import { Box } from "@mantine/core";
import React from "react";

export default function Page({ children, ...props }: Props) {
  return (
    <main>
      <Box
        sx={() => ({
          minHeight: "100vh",
          padding: "0px 64px",
        })}
        {...props}
      >
        {children}
      </Box>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Box>;
