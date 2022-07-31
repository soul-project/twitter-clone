import React from "react";
import { Button, HStack, Icon, Link } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { useSession } from "next-auth/react";
import NextLink from "next/link";

export default function NavbarMobile({ onOpenCreatePostModal }: Props) {
  const { data: session } = useSession();

  return (
    <HStack
      display={["flex", "none"]}
      position="fixed"
      bottom="0"
      w="100%"
      bgColor="gray.800"
      zIndex={999}
      padding="12px"
      justifyContent="center"
      spacing="48px"
      borderTop="1px solid var(--chakra-colors-border-gray)"
    >
      {session && (
        <NextLink passHref href={`/profiles/${session?.user.id}`}>
          <Link _hover={{ textDecoration: "none" }}>
            <Button variant="ghost">
              <Icon as={BsFillPersonFill} height="26px" width="26px" />
            </Button>
          </Link>
        </NextLink>
      )}
      <NextLink passHref href="/">
        <Link _hover={{ textDecoration: "none" }}>
          <Button variant="ghost">
            <Icon as={AiFillHome} height="26px" width="26px" />
          </Button>
        </Link>
      </NextLink>
      {session && (
        <Button variant="ghost" onClick={onOpenCreatePostModal}>
          <Icon as={IoIosSend} height="26px" width="26px" />
        </Button>
      )}
    </HStack>
  );
}

type Props = {
  onOpenCreatePostModal: () => void;
};
