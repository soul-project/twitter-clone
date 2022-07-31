import React from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Avatar,
  HStack,
  Text,
  Link,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

export default function DrawerMobile({ isOpen, onClose }: Props) {
  const { data: session } = useSession();

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Account info</DrawerHeader>

        <DrawerBody>
          <VStack w="100%" alignItems="flex-start" spacing="16px">
            {session && (
              <NextLink passHref href={`/profiles/${session!.user.id}`}>
                <Link _hover={{ textDecoration: "none" }}>
                  <HStack>
                    <Avatar name={session!.user.username} />
                    <Text
                      fontWeight="bold"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {session!.user.username}
                    </Text>
                  </HStack>
                </Link>
              </NextLink>
            )}
            <Divider />
            {session && (
              <>
                <NextLink passHref href="/connections">
                  <Link>
                    <Button variant="link">Connections</Button>
                  </Link>
                </NextLink>
                <Divider />
              </>
            )}
            <Button
              onClick={() => (session ? signOut() : signIn("soul"))}
              variant="link"
            >
              {session ? "Log out" : "Log in"}
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
