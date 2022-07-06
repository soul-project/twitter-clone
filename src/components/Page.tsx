import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import NavbarMobile from "./Page/NavbarMobile";

import PageTitle from "./Page/PageTitle";
import Sidebar from "./Page/Sidebar";
import CreateNewPostModal from "./Page/Sidebar/CreateNewPostModal";

export default function Page({ children, title, ...props }: Props) {
  const {
    isOpen: isOpenCreatePostModal,
    onOpen: onOpenCreatePostModal,
    onClose: onCloseCreatePostModal,
  } = useDisclosure();

  return (
    <main>
      <CreateNewPostModal
        onCloseCreatePostModal={onCloseCreatePostModal}
        isOpenCreatePostModal={isOpenCreatePostModal}
      />
      <HStack
        alignItems="flex-start"
        justifyContent="center"
        w={["100vw", "100vw", "100vw", "auto"]}
        spacing="0px"
      >
        <Sidebar
          display={["none", "block"]}
          mr="16px"
          onOpenCreatePostModal={onOpenCreatePostModal}
        />
        <NavbarMobile onOpenCreatePostModal={onOpenCreatePostModal} />
        <Box
          minHeight="100vh"
          maxW="600px"
          minW="0px"
          w="100%"
          flexGrow={1}
          borderLeft={["none", "1px solid var(--chakra-colors-border-gray)"]}
          borderRight={["none", "1px solid var(--chakra-colors-border-gray)"]}
          paddingTop="32px"
          {...props}
        >
          <PageTitle title={title} />
          <Box mb={["64px", "0px"]}>{children}</Box>
        </Box>
      </HStack>
    </main>
  );
}

type Props = {
  children: React.ReactNode;
  title: string;
} & React.ComponentProps<typeof Box>;
