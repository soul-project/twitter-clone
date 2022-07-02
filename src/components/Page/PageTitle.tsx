import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function PageTitle() {
  // TODO: Check the URL before deciding if this is home or other pages
  return (
    <Box padding="0px 16px">
      <Text fontSize="2xl" fontWeight="bold">
        Home
      </Text>
    </Box>
  );
}
