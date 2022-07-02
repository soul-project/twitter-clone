import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function PageTitle() {
  const router = useRouter();

  const getTitle = () => {
    switch (router.pathname) {
      case "/":
        return "Home";
      case "/profiles/[userId]":
        return "Profile";
      default:
        return "Home";
    }
  };

  return (
    <Box padding="0px 16px">
      <Text fontSize="2xl" fontWeight="bold">
        {getTitle()}
      </Text>
    </Box>
  );
}
