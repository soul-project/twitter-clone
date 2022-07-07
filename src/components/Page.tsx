import React from "react";
import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import DrawerMobile from "./Page/DrawerMobile";
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
  const {
    isOpen: isOpenMobileDrawer,
    onOpen: onOpenMobileDrawer,
    onClose: onCloseMobileDrawer,
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
        <DrawerMobile
          isOpen={isOpenMobileDrawer}
          onClose={onCloseMobileDrawer}
        />
        <Box
          minHeight="100vh"
          maxW="600px"
          minW="0px"
          w="100%"
          flexGrow={1}
          borderLeft={["none", "1px solid var(--chakra-colors-border-gray)"]}
          borderRight={["none", "1px solid var(--chakra-colors-border-gray)"]}
          {...props}
        >
          <PageTitle title={title} onOpenMobileDrawer={onOpenMobileDrawer} />
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
