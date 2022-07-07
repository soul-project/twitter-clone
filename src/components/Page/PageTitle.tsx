import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function PageTitle({ title, onOpenMobileDrawer }: Props) {
  return (
    <HStack
      paddingY="32px"
      position="sticky"
      top="0px"
      bgColor="gray.800"
      spacing="16px"
      zIndex={999}
    >
      <Button
        variant="ghost"
        onClick={onOpenMobileDrawer}
        display={["block", "none"]}
      >
        <HamburgerIcon height="26px" width="26px" />
      </Button>
      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
    </HStack>
  );
}

type Props = {
  title: string;
  onOpenMobileDrawer: () => void;
};
