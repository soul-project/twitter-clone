import React from "react";
import { Button, HStack, Icon, Link } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function NavbarMobile({ onOpenCreatePostModal }: Props) {
  const { data: session } = useSession();

  return (
    <HStack
      display={["flex", "none"]}
      position="fixed"
      bottom="0"
      w="100%"
      bgColor="black"
      zIndex={999}
      padding="12px"
      justifyContent="center"
      spacing="48px"
    >
      <Link
        href={`/profiles/${session?.user.id}`}
        _hover={{ textDecoration: "none" }}
      >
        <Button variant="ghost">
          <Icon as={BsFillPersonFill} height="26px" width="26px" />
        </Button>
      </Link>
      <Link href="/" _hover={{ textDecoration: "none" }}>
        <Button variant="ghost">
          <Icon as={AiFillHome} height="26px" width="26px" />
        </Button>
      </Link>
      <Button variant="ghost" onClick={onOpenCreatePostModal}>
        <Icon as={IoIosSend} height="26px" width="26px" />
      </Button>
    </HStack>
  );
}

type Props = {
  onOpenCreatePostModal: () => void;
};
