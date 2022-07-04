import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function PageTitle({ title }: Props) {
  return (
    <Box padding="0px 16px">
      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
    </Box>
  );
}

type Props = {
  title: string;
};
